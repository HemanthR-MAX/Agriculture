// client/src/pages/farmer/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, IndianRupee, Clock } from 'lucide-react';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';
import { formatCurrencyDisplay } from '../../utils/formatCurrency';

const FarmerDashboard = () => {
  const [stats, setStats] = useState({
    activeCrops: 0,
    expectedEarnings: 0,
    pendingPayments: 0
  });
  const [crops, setCrops] = useState([]);
  const [contracts, setContracts] = useState([]);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      const [cropsRes, contractsRes] = await Promise.all([
        api.get('/crops/farmer'),
        api.get('/contracts/farmer')
      ]);
      
      const activeCrops = cropsRes.data.crops.filter(c => c.status === 'Growing');
      const activeContracts = contractsRes.data.contracts.filter(c => c.status !== 'Completed');
      
      setStats({
        activeCrops: activeCrops.length,
        expectedEarnings: activeContracts.reduce((sum, c) => sum + c.details.totalAmount, 0),
        pendingPayments: activeContracts.reduce((sum, c) => sum + (c.payment.advancePaid ? 0 : c.payment.advanceAmount), 0)
      });
      
      setCrops(activeCrops.slice(0, 3));
      setContracts(activeContracts.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        <TranslatedText>Welcome back!</TranslatedText>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                <TranslatedText>Active Crops</TranslatedText>
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeCrops}</p>
            </div>
            <Sprout className="w-12 h-12 text-primary opacity-20" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                <TranslatedText>Expected Earnings</TranslatedText>
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrencyDisplay(stats.expectedEarnings)}</p>
            </div>
            <IndianRupee className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                <TranslatedText>Pending Payments</TranslatedText>
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrencyDisplay(stats.pendingPayments)}</p>
            </div>
            <Clock className="w-12 h-12 text-accent opacity-20" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            <TranslatedText>Active Crops</TranslatedText>
          </h2>
          <Link to="/farmer/crops/add" className="text-primary hover:underline">
            <TranslatedText>Add New Crop</TranslatedText>
          </Link>
        </div>
        
        {crops.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            <TranslatedText>No active crops. Add your first crop to get started!</TranslatedText>
          </p>
        ) : (
          <div className="space-y-4">
            {crops.map((crop) => (
              <Link key={crop._id} to={`/farmer/crops/${crop._id}`} className="block border rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{crop.cropDetails.cropType}</h3>
                    <p className="text-sm text-gray-600">
                      <TranslatedText>Planted:</TranslatedText> {new Date(crop.cropDetails.plantingDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <TranslatedText>Expected Yield:</TranslatedText> {crop.prediction.expectedYield} kg
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      <TranslatedText>{crop.status}</TranslatedText>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            <TranslatedText>Recent Contracts</TranslatedText>
          </h2>
          <Link to="/farmer/contracts" className="text-primary hover:underline">
            <TranslatedText>View All</TranslatedText>
          </Link>
        </div>
        
        {contracts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            <TranslatedText>No contracts yet</TranslatedText>
          </p>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div key={contract._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{contract.companyId.companyInfo.companyName}</h3>
                    <p className="text-sm text-gray-600">
                      {contract.details.quantity} kg × {formatCurrencyDisplay(contract.details.pricePerKg)} = {formatCurrencyDisplay(contract.details.totalAmount)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    contract.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                    contract.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    <TranslatedText>{contract.status}</TranslatedText>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
