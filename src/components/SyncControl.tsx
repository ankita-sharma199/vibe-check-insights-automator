
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useFeedbackData } from './RealtimeFeedbackProvider';
import { useToast } from '@/hooks/use-toast';

const SyncControl = () => {
  const { feedbackData, loading, error, triggerSync } = useFeedbackData();
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await triggerSync();
      toast({
        title: "Sync Started",
        description: "Google Sheets sync has been triggered. New data will appear automatically.",
      });
    } catch (err) {
      toast({
        title: "Sync Failed",
        description: "Failed to trigger Google Sheets sync. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const latestEntry = feedbackData[0];
  const totalEntries = feedbackData.length;

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span>Data Sync Control</span>
          </div>
          <Badge variant={error ? "destructive" : "default"}>
            {error ? "Error" : "Connected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalEntries}</div>
            <div className="text-sm text-gray-600">Total Responses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {latestEntry ? '✓' : '—'}
            </div>
            <div className="text-sm text-gray-600">Latest Sync</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {latestEntry ? 
                new Date(latestEntry.timestamp).toLocaleDateString() : 
                'No data'
              }
            </div>
            <div className="text-sm text-gray-600">Last Response</div>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Auto-sync: Daily at 9 AM
            </span>
          </div>
          <Button 
            onClick={handleSync}
            disabled={syncing || loading}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>

        {latestEntry && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-1">Latest Entry:</div>
            <div className="text-xs text-gray-600">
              <div>Employee: {latestEntry.employee_name || 'Anonymous'}</div>
              <div>Department: {latestEntry.department || 'N/A'}</div>
              <div>Satisfaction: {latestEntry.satisfaction_score}/10</div>
              <div>Sentiment: {latestEntry.sentiment_label}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SyncControl;
