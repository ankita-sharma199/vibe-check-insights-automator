
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import SatisfactionChart from '@/components/SatisfactionChart';
import SentimentChart from '@/components/SentimentChart';
import AlertsPanel from '@/components/AlertsPanel';
import { TrendingUp, TrendingDown, Users, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

const HRDashboard = () => {
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const metrics = [
    {
      title: 'Overall Satisfaction',
      value: '7.2',
      subtitle: 'out of 10',
      change: '+0.3',
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: CheckCircle
    },
    {
      title: 'Response Rate',
      value: '87%',
      subtitle: '261 of 300 employees',
      change: '+5%',
      trend: 'up',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: Users
    },
    {
      title: 'Positive Sentiment',
      value: '68%',
      subtitle: 'of comments',
      change: '-2%',
      trend: 'down',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: MessageSquare
    },
    {
      title: 'Active Alerts',
      value: '3',
      subtitle: 'departments below threshold',
      change: '+1',
      trend: 'down',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: AlertTriangle
    }
  ];

  const departmentScores = [
    { name: 'Engineering', score: 8.1, employees: 45, trend: 'up' },
    { name: 'Sales', score: 7.8, employees: 32, trend: 'up' },
    { name: 'Marketing', score: 7.5, employees: 28, trend: 'stable' },
    { name: 'HR', score: 7.2, employees: 12, trend: 'up' },
    { name: 'Operations', score: 6.8, employees: 38, trend: 'down' },
    { name: 'Customer Support', score: 6.5, employees: 24, trend: 'down' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HR Dashboard</h1>
        <p className="text-gray-600">Employee Satisfaction Insights for {currentMonth}</p>
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
                    <span>{dept.employees} employees</span>
                    <Progress value={dept.score * 10} className="w-20 h-2" />
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
