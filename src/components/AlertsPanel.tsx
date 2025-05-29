
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const AlertsPanel = () => {
  const alerts = [
    {
      id: 1,
      type: 'critical',
      department: 'Customer Support',
      message: 'Satisfaction score dropped below 70% threshold (65%)',
      recommendation: 'Schedule team meeting to address workload concerns',
      time: '2 hours ago',
      status: 'active'
    },
    {
      id: 2,
      type: 'warning',
      department: 'Operations',
      message: 'Team dynamics score declining for 2 consecutive months',
      recommendation: 'Consider team building workshop or conflict resolution session',
      time: '1 day ago',
      status: 'active'
    },
    {
      id: 3,
      type: 'info',
      department: 'Engineering',
      message: 'Growth opportunities satisfaction increased significantly',
      recommendation: 'Document and replicate successful practices in other departments',
      time: '3 days ago',
      status: 'resolved'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Warning</Badge>;
      default:
        return <Badge variant="default" className="bg-green-100 text-green-800">Info</Badge>;
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <span>Active Alerts & Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-4 border rounded-lg transition-all ${
              alert.status === 'resolved' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getAlertIcon(alert.type)}
                <span className="font-medium text-gray-900">{alert.department}</span>
                {getAlertBadge(alert.type)}
              </div>
              <span className="text-xs text-gray-500">{alert.time}</span>
            </div>
            
            <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
            
            <div className="bg-blue-50 p-3 rounded-md mb-3">
              <p className="text-sm text-blue-800">
                <strong>Recommendation:</strong> {alert.recommendation}
              </p>
            </div>
            
            {alert.status === 'active' && (
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  Mark as Resolved
                </Button>
                <Button size="sm" variant="outline">
                  Take Action
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
