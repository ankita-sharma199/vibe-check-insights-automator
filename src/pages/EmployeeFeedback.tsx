
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Star, Send } from 'lucide-react';

const EmployeeFeedback = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    anonymous: false,
    employeeName: '',
    department: '',
    workSatisfaction: [7],
    teamDynamics: [7],
    leadership: [7],
    growthOpportunities: [7],
    companyCulture: [7],
    happinessIndex: [7],
    positiveComments: '',
    improvementSuggestions: '',
    additionalFeedback: ''
  });

  const handleSliderChange = (field: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Feedback Submitted Successfully!",
        description: "Thank you for your valuable feedback. Your responses help us improve.",
      });
      
      // Reset form
      setFormData({
        anonymous: false,
        employeeName: '',
        department: '',
        workSatisfaction: [7],
        teamDynamics: [7],
        leadership: [7],
        growthOpportunities: [7],
        companyCulture: [7],
        happinessIndex: [7],
        positiveComments: '',
        improvementSuggestions: '',
        additionalFeedback: ''
      });
    }, 1000);
  };

  const SliderSection = ({ title, field, value }: { title: string, field: string, value: number[] }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-gray-700">{title}</Label>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-lg font-bold text-blue-600">{value[0]}/10</span>
        </div>
      </div>
      <Slider
        value={value}
        onValueChange={(newValue) => handleSliderChange(field, newValue)}
        max={10}
        min={1}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Very Dissatisfied</span>
        <span>Neutral</span>
        <span>Very Satisfied</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Monthly Employee Feedback</h1>
        <p className="text-gray-600">Your voice matters. Help us create a better workplace for everyone.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={formData.anonymous}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: !!checked }))}
              />
              <Label htmlFor="anonymous" className="text-sm">Submit this feedback anonymously</Label>
            </div>
            
            {!formData.anonymous && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeName">Employee Name</Label>
                  <Input
                    id="employeeName"
                    value={formData.employeeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g., Engineering, Sales, Marketing"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Satisfaction Ratings */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Satisfaction Ratings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SliderSection 
              title="Work Satisfaction" 
              field="workSatisfaction" 
              value={formData.workSatisfaction} 
            />
            <SliderSection 
              title="Team Dynamics" 
              field="teamDynamics" 
              value={formData.teamDynamics} 
            />
            <SliderSection 
              title="Leadership & Management" 
              field="leadership" 
              value={formData.leadership} 
            />
            <SliderSection 
              title="Growth Opportunities" 
              field="growthOpportunities" 
              value={formData.growthOpportunities} 
            />
            <SliderSection 
              title="Company Culture" 
              field="companyCulture" 
              value={formData.companyCulture} 
            />
            <SliderSection 
              title="Overall Happiness Index" 
              field="happinessIndex" 
              value={formData.happinessIndex} 
            />
          </CardContent>
        </Card>

        {/* Open-ended Comments */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Additional Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="positiveComments">What's going well? Share your positive experiences.</Label>
              <Textarea
                id="positiveComments"
                value={formData.positiveComments}
                onChange={(e) => setFormData(prev => ({ ...prev, positiveComments: e.target.value }))}
                placeholder="Tell us about the things you appreciate..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="improvementSuggestions">What could be improved? Share your suggestions.</Label>
              <Textarea
                id="improvementSuggestions"
                value={formData.improvementSuggestions}
                onChange={(e) => setFormData(prev => ({ ...prev, improvementSuggestions: e.target.value }))}
                placeholder="Share your ideas for improvement..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="additionalFeedback">Any additional feedback or concerns?</Label>
              <Textarea
                id="additionalFeedback"
                value={formData.additionalFeedback}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalFeedback: e.target.value }))}
                placeholder="Anything else you'd like to share..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" size="lg" className="px-8 py-3 bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeFeedback;
