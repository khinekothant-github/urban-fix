'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/app/api';
import { Issue, User } from '@/app/types';
import { format } from 'date-fns';

export default function IssueDetails() {
  const params = useParams();
  const router = useRouter();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssue = async () => {
      if (!params.id) return;
      
      try {
        const data = await api.getIssue(Number(params.id));
        setIssue(data);
      } catch (error) {
        console.error('Error loading issue:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Issue Not Found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      road: 'Road',
      garbage: 'Garbage',
      flood: 'Flood',
      light: 'Street Light',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      road: 'bg-blue-100 text-blue-800',
      garbage: 'bg-green-100 text-green-800',
      flood: 'bg-yellow-100 text-yellow-800',
      light: 'bg-purple-100 text-purple-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      verified: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-green-100 text-green-800',
      fixed: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button onClick={() => router.back()} variant="secondary" className="mb-4">
          ← Back
        </Button>
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{issue.title}</h1>
            <div className="flex gap-2 items-center mb-4">
              <Badge className={getCategoryColor(issue.category)}>
                {getCategoryLabel(issue.category)}
              </Badge>
              <Badge className={getStatusColor(issue.status)}>
                {issue.status.replace('_', ' ')}
              </Badge>
              <span className="text-gray-500 text-sm">
                Reported by {issue.user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">{issue.description}</p>
            
            {issue.photo_path && (
              <div className="mt-4">
                <img 
                  src={`http://localhost:8000/storage/${issue.photo_path}`} 
                  alt="Issue"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Location</div>
              <div className="text-gray-700">{issue.address}</div>
              <div className="text-xs text-gray-500 mt-1">
                {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Reported On</div>
              <div className="text-gray-700">
                {format(new Date(issue.created_at), 'MMM d, yyyy')}
              </div>
            </div>

            {issue.user && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Reported By</div>
                <div className="text-gray-700">{issue.user.name}</div>
                <div className="text-xs text-gray-500">{issue.user.email}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {issue.updates && issue.updates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Status History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {issue.updates.map((update) => (
                <div key={update.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">
                      Status updated from {update.old_status.replace('_', ' ')} to {update.new_status.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-gray-500">
                      By {update.user?.name} on {format(new Date(update.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}