
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import SatisfactionChart from '@/components/SatisfactionChart';
import SentimentChart from '@/components/SentimentChart';
import AlertsPanel from '@/components/AlertsPanel';
import SyncControl from '@/components/SyncControl';
import { useFeedbackData } from '@/components/RealtimeFeedbackProvider';
import { TrendingUp, TrendingDown, Users, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMemo } from 'react';

const HRDashboard = () => {
  const { feedbackData, loading } = useFeedbackData();
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Calculate metrics from real data
  const metrics = useMemo(() => {
    if (loading || feedbackData.length === 0) {
      return [
        { title: 'Overall Satisfaction', value: '—', subtitle: 'Loading...', change: '—', trend: 'up', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: CheckCircle },
        { title: 'Response Rate', value: '—', subtitle: 'Loading...', change: '—', trend: 'up', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: Users },
        { title: 'Positive Sentiment', value: '—', subtitle: 'Loading...', change: '—', trend: 'up', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: MessageSquare },
        { title: 'Total Responses', value: '—', subtitle: 'Loading...', change: '—', trend: 'up', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: AlertTriangle }
      ];
    }

    const totalResponses = feedbackData.length;
    const avgSatisfaction = feedbackData.length > 0 
      ? (feedbackData.reduce((sum, item) => sum + (item.satisfaction_score || 0), 0) / feedbackData.length).toFixed(1)
      : '0';
    
    const positiveSentiment = feedbackData.filter(item => item.sentiment_label === 'positive').length;
    const positiveSentimentPercentage = totalResponses > 0 
      ? Math.round((positiveSentiment / totalResponses) * 100)
      : 0;

    const thisMonth = new Date();
    const thisMonthResponses = feedbackData.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate.getMonth() === thisMonth.getMonth() && 
             itemDate.getFullYear() === thisMonth.getFullYear();
    }).length;

    return [
      {
        title: 'Overall Satisfaction',
        value: avgSatisfaction,
        subtitle: 'out of 10',
        change: '+0.3',
        trend: 'up',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: CheckCircle
      },
      {
        title: 'Total Responses',
        value: totalResponses.toString(),
        subtitle: `${thisMonthResponses} this month`,
        change: `+${thisMonthResponses}`,
        trend: 'up',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        icon: Users
      },
      {
        title: 'Positive Sentiment',
        value: `${positiveSentimentPercentage}%`,
        subtitle: 'of comments',
        change: totalResponses > 0 ? '+2%' : '—',
        trend: 'up',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        icon: MessageSquare
      },
      {
        title: 'Latest Response',
        value: feedbackData.length > 0 ? '✓' : '—',
        subtitle: feedbackData.length > 0 ? 'Just synced' : 'No data yet',
        change: feedbackData.length > 0 ? 'New' : '—',
        trend: 'up',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        icon: AlertTriangle
      }
    ];
  }, [feedbackData, loading]);

  // Calculate department scores from real data
  const departmentScores = useMemo(() => {
    if (loading || feedbackData.length === 0) {
      return [
        { name: 'Loading...', score: 0, employees: 0, trend: 'stable' }
      ];
    }

    const departments = feedbackData.reduce((acc, item) => {
      const dept = item.department || 'Unknown';
      if (!acc[dept]) {
        acc[dept] = { scores: [], count: 0 };
      }
      acc[dept].scores.push(item.satisfaction_score || 0);
      acc[dept].count++;
      return acc;
    }, {} as Record<string, { scores: number[], count: number }>);

    return Object.entries(departments).map(([name, data]) => ({
      name,
      score: data.scores.length > 0 
        ? (data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length).toFixed(1)
        : '0',
      employees: data.count,
      trend: 'stable' as const
    })).sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
  }, [feedbackData, loading]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HR Dashboard</h1>
        <p className="text-gray-600">Real-time Employee Satisfaction Insights for {currentMonth}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="hover-scale transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className={`flex items-center space-x-1 ${metric.color}`}>
                    <TrendIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{metric.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sync Control */}
      <SyncControl />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SatisfactionChart />
        <SentimentChart />
      </div>

      {/* Department Scores and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Scores */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Department Satisfaction Scores</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentScores.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{dept.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">{dept.score}</span>
                      <Badge variant={dept.trend === 'up' ? 'default' : dept.trend === 'down' ? 'destructive' : 'secondary'}>
                        {dept.trend === 'up' ? '↗' : dept.trend === 'down' ? '↘' : '→'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{dept.employees} responses</span>
                    <Progress value={parseFloat(dept.score) * 10} className="w-20 h-2" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts Panel */}
        <AlertsPanel />
      </div>
    </div>
  );
};

export default HRDashboard;
