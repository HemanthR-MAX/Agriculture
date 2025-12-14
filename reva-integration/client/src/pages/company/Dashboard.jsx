// client/src/pages/company/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Package, FileText, TrendingUp } from 'lucide-react';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';

const CompanyDashboard = () => {
  const [stats, setStats] = useState({
    activeRequirements: 0,
    activeContracts: 0,
    totalSpent: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [reqRes, contractRes] = await Promise.all([
        api.get('/requirements/company'),
        api.get('/contracts/company')
      ]);

      const activeReqs = reqRes.data.requirements.filter(r => r.status === 'Active');
      const activeContracts = contractRes.data.contracts.filter(c => c.status !== 'Completed');
      const totalSpent = contractRes.data.contracts.reduce((sum, c) => sum + (c.details.totalAmount || 0), 0);

      setStats({
        activeRequirements: activeReqs.length,
        activeContracts: activeContracts.length,
        totalSpent
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        <TranslatedText>Dashboard</TranslatedText>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                <TranslatedText>Active Requirements</TranslatedText>
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeRequirements}</p>
            </div>
            <Package className="w-12 h-12 text-secondary opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                <TranslatedText>Active Contracts</TranslatedText>
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeContracts}</p>
            </div>
            <FileText className="w-12 h-12 text-secondary opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                <TranslatedText>Total Procurement</TranslatedText>
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalSpent.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
