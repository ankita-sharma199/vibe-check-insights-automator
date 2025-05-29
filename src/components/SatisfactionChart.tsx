
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const SatisfactionChart = () => {
  const data = [
    { month: 'Jun', satisfaction: 6.8, happiness: 6.5 },
    { month: 'Jul', satisfaction: 7.1, happiness: 6.9 },
    { month: 'Aug', satisfaction: 6.9, happiness: 6.7 },
    { month: 'Sep', satisfaction: 7.3, happiness: 7.1 },
    { month: 'Oct', satisfaction: 6.9, happiness: 6.8 },
    { month: 'Nov', satisfaction: 7.2, happiness: 7.0 },
  ];

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span>Satisfaction Trends</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              domain={[5, 10]}
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="satisfaction" 
              stroke="#2563eb" 
              strokeWidth={3}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
              name="Overall Satisfaction"
            />
            <Line 
              type="monotone" 
              dataKey="happiness" 
              stroke="#059669" 
              strokeWidth={3}
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              name="Happiness Index"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SatisfactionChart;
