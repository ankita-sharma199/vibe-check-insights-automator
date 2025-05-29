
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import EmployeeFeedback from '@/pages/EmployeeFeedback';
import HRDashboard from '@/pages/HRDashboard';
import Reports from '@/pages/Reports';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HRDashboard />} />
          <Route path="/feedback" element={<EmployeeFeedback />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
};

export default Index;
