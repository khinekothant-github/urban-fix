'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MapView from '@/components/MapView';
import IssueCard from '@/components/IssueCard';
import ReportModal from '@/components/ReportModal';
import { api } from '@/app/api';
import { Issue } from '@/app/types';

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | undefined>();

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterCategory, filterStatus, searchTerm, issues]);

  const loadIssues = async () => {
    setLoading(true);
    try {
      const data = await api.getIssues();
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

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedPosition({ lat, lng });
    setShowReportModal(true);
  };

  const handleReportSubmit = async (data: any) => {
    try {
      await api.createIssue(data);
      await loadIssues();
    } catch (error) {
      console.error('Error creating issue:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">City Issue Reporter</h1>
          </div>
          
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-32">
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
              <SelectTrigger className="w-32">
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

            <Button onClick={() => setShowReportModal(true)}>Report Issue</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Map Container */}
        <div className="flex-1 h-full relative">
          <MapView 
            issues={filteredIssues} 
            onMapClick={handleMapClick}
          />
          
          {loading && (
            <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md">
              Loading...
            </div>
          )}
        </div>

        {/* Issue List */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Issues ({filteredIssues.length})</h2>
          </div>

          <div className="p-4 space-y-4">
            {filteredIssues.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No issues found
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
        initialPosition={selectedPosition}
      />
    </div>
  );
}
