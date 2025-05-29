
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

const Reports = () => {
  const reports = [
    {
      title: 'November 2024 - Monthly Satisfaction Report',
      date: '2024-11-30',
      status: 'Ready',
      highlights: [
        'Overall satisfaction improved by 0.3 points',
        '87% response rate achieved',
        '3 departments flagged for attention'
      ]
    },
    {
      title: 'October 2024 - Monthly Satisfaction Report',
      date: '2024-10-31',
      status: 'Ready',
      highlights: [
        'Overall satisfaction declined by 0.1 points',
        '82% response rate',
        'Engineering team showed significant improvement'
      ]
    },
    {
      title: 'September 2024 - Monthly Satisfaction Report',
      date: '2024-09-30',
      status: 'Ready',
      highlights: [
        'Stable satisfaction levels maintained',
        '79% response rate',
        'New wellness program shows positive impact'
      ]
    }
  ];

  const actionableInsights = [
    {
      priority: 'High',
      department: 'Customer Support',
      issue: 'Low satisfaction with growth opportunities (5.2/10)',
      recommendation: 'Implement structured career development program and mentorship initiatives',
      estimatedImpact: 'High'
    },
    {
      priority: 'Medium',
      department: 'Operations',
      issue: 'Team dynamics score declining (6.8/10)',
      recommendation: 'Facilitate team building workshops and improve cross-team communication',
      estimatedImpact: 'Medium'
    },
    {
      priority: 'Medium',
      department: 'Sales',
      issue: 'Work-life balance concerns in open comments',
      recommendation: 'Review workload distribution and consider flexible working arrangements',
      estimatedImpact: 'High'
    }
  ];

  const handleDownload = (reportTitle: string) => {
    // Simulate PDF download
    console.log(`Downloading: ${reportTitle}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Insights</h1>
        <p className="text-gray-600">Monthly reports and actionable recommendations for leadership</p>
      </div>

      {/* Actionable Insights */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <span>Actionable Insights & Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {actionableInsights.map((insight, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant={insight.priority === 'High' ? 'destructive' : 'secondary'}>
                    {insight.priority} Priority
                  </Badge>
                  <span className="font-medium text-gray-900">{insight.department}</span>
                </div>
                <Badge variant="outline">
                  {insight.estimatedImpact} Impact
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-700"><strong>Issue:</strong> {insight.issue}</p>
                <p className="text-sm text-blue-700"><strong>Recommendation:</strong> {insight.recommendation}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Available Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reports.map((report, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                    <Badge variant="outline" className="text-green-700 border-green-200">
                      {report.status}
                    </Badge>
                  </div>
                </div>
                <Button 
                  onClick={() => handleDownload(report.title)}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Key Highlights:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {report.highlights.map((highlight, highlightIndex) => (
                    <li key={highlightIndex} className="flex items-center space-x-2">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>Export to PDF</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Download className="h-6 w-6" />
              <span>Export to Excel</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
