
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeedbackData {
  id: string;
  timestamp: string;
  employee_name: string | null;
  department: string | null;
  satisfaction_score: number | null;
  happiness_index: number | null;
  team_dynamics_score: number | null;
  leadership_score: number | null;
  growth_opportunities_score: number | null;
  company_culture_score: number | null;
  open_comments: string | null;
  sentiment_score: number | null;
  sentiment_label: string | null;
  processed_at: string;
  created_at: string;
}

interface FeedbackContextType {
  feedbackData: FeedbackData[];
  loading: boolean;
  error: string | null;
  triggerSync: () => Promise<void>;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const useFeedbackData = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedbackData must be used within a FeedbackProvider');
  }
  return context;
};

interface FeedbackProviderProps {
  children: ReactNode;
}

export const RealtimeFeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employee_feedback')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        throw error;
      }

      setFeedbackData(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching feedback data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const triggerSync = async () => {
    try {
      console.log('Triggering Google Sheets sync...');
      const { data, error } = await supabase.functions.invoke('sync-google-sheets');
      
      if (error) {
        throw error;
      }
      
      console.log('Sync completed:', data);
      // Data will be automatically updated via real-time subscription
    } catch (err) {
      console.error('Error triggering sync:', err);
      setError(err instanceof Error ? err.message : 'Sync failed');
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchFeedbackData();

    // Set up real-time subscription
    const channel = supabase
      .channel('employee-feedback-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employee_feedback'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            setFeedbackData(prev => [payload.new as FeedbackData, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setFeedbackData(prev => 
              prev.map(item => 
                item.id === payload.new.id ? payload.new as FeedbackData : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setFeedbackData(prev => 
              prev.filter(item => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <FeedbackContext.Provider 
      value={{ 
        feedbackData, 
        loading, 
        error, 
        triggerSync 
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};
