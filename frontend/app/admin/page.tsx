'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/app/api';
import { Issue, IssueUpdate } from '@/app/types';
import { format } from 'date-fns';

export default function AdminPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterCategory, filterStatus, searchTerm, issues]);

  const loadIssues = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminIssues();
      setIssues(data);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...issues];

    if (filterCategory && filterCategory !== 'all') {
      filtered = filtered.filter(issue => issue.category === filterCategory);
    }

    if (filterStatus && filterStatus !== 'all') {
      filtered = filtered.filter(issue => issue.status === filterStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        issue => 
          issue.title.toLowerCase().includes(term) || 
          issue.description.toLowerCase().includes(term) || 
          issue.address.toLowerCase().includes(term)
      );
    }

    setFilteredIssues(filtered);
  };

  const handleStatusChange = async (issue: Issue, newStatus: string) => {
    try {
      const updatedIssue = await api.updateIssueStatus(issue.id, newStatus);
      setIssues(prev => prev.map(prevIssue => 
        prevIssue.id === issue.id ? updatedIssue : prevIssue
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

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

  const getStatusOptions = (currentStatus: string) => {
    const allStatuses = ['pending', 'verified', 'in_progress', 'fixed'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Button onClick={() => router.push('/')} variant="secondary">
            ← Back to Map
          </Button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Input
              type="search"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="road">Road</SelectItem>
              <SelectItem value="garbage">Garbage</SelectItem>
              <SelectItem value="flood">Flood</SelectItem>
              <SelectItem value="light">Street Light</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issues ({filteredIssues.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported On</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No issues found
                  </TableCell>
                </TableRow>
              ) : (
                filteredIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">{issue.title}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(issue.category)}>
                        {getCategoryLabel(issue.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(issue.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{issue.user?.name}</TableCell>
                    <TableCell>
                      <Select
                        value=""
                        onValueChange={(newStatus) => handleStatusChange(issue, newStatus)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {getStatusOptions(issue.status).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}