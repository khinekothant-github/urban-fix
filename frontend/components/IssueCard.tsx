'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Issue } from '@/app/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface IssueCardProps {
  issue: Issue;
}

const IssueCard = ({ issue }: IssueCardProps) => {
  const router = useRouter();
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

  const handleClick = () => {
    router.push(`/issue/${issue.id}`);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200" 
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">{issue.title}</CardTitle>
          <div className="flex gap-2">
            <Badge className={getCategoryColor(issue.category)}>
              {getCategoryLabel(issue.category)}
            </Badge>
            <Badge className={getStatusColor(issue.status)}>
              {issue.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">{issue.description}</p>
        <div className="text-xs text-gray-500">
          <div>Reported on {format(new Date(issue.created_at), 'MMM d, yyyy')}</div>
          <div className="line-clamp-1">{issue.address}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCard;