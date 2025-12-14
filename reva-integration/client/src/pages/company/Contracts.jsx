// client/src/pages/company/Contracts.jsx
import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';
import { format } from 'date-fns';
import { formatCurrencyDisplay } from '../../utils/formatCurrency';

const CompanyContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    fetchContracts();
  }, []);
  
  const fetchContracts = async () => {
    try {
      const response = await api.get('/contracts/company');
      setContracts(response.data.contracts);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCompleteDelivery = async (contractId) => {
    const approved = window.confirm('Confirm delivery and quality approval?');
    if (!approved) return;
    
    try {
      await api.post(`/contracts/${contractId}/complete`, {
        qualityCheck: {
          approved: true,
          actualGrade: 'B',
          actualQuantity: 950,
          inspectorNotes: 'Quality approved'
        }
      });
      
      alert('Delivery completed! Payment released to farmer.');
      fetchContracts();
    } catch (error) {
      alert('Error completing delivery: ' + error.message);
    }
  };
  
  const filteredContracts = contracts.filter(contract => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['Confirmed', 'In Progress'].includes(contract.status);
    return contract.status === filter;
  });
  
  if (loading) {
    return <div className="text-center py-12">
      <TranslatedText>Loading...</TranslatedText>
    </div>;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        <TranslatedText>Contracts</TranslatedText>
      </h1>
      
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md transition ${
            filter === 'all' ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <TranslatedText>All</TranslatedText>
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-md transition ${
            filter === 'active' ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <TranslatedText>Active</TranslatedText>
        </button>
        <button
          onClick={() => setFilter('Completed')}
          className={`px-4 py-2 rounded-md transition ${
            filter === 'Completed' ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <TranslatedText>Completed</TranslatedText>
        </button>
      </div>
      
      {filteredContracts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            <TranslatedText>No contracts found</TranslatedText>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContracts.map((contract) => (
            <div key={contract._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{contract.farmerId.personalInfo.name}</h3>
                  <p className="text-sm text-gray-600">
                    {contract.farmerId.personalInfo.village}, {contract.farmerId.personalInfo.district}
                  </p>
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Phone:</TranslatedText> {contract.farmerId.personalInfo.phone}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  contract.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  contract.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  <TranslatedText>{contract.status}</TranslatedText>
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Crop</TranslatedText>
                  </p>
                  <p className="font-medium">{contract.details.cropType}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Quantity</TranslatedText>
                  </p>
                  <p className="font-medium">{contract.details.quantity} kg</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Price</TranslatedText>
                  </p>
                  <p className="font-medium">{formatCurrencyDisplay(contract.details.pricePerKg)}/kg</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Total</TranslatedText>
                  </p>
                  <p className="font-medium text-lg">{formatCurrencyDisplay(contract.details.totalAmount)}</p>
                </div>
              </div>
              
              {contract.details.harvestDates && contract.details.harvestDates.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Scheduled Pickup</TranslatedText>
                  </p>
                  <p className="font-medium">
                    {format(new Date(contract.details.harvestDates[0]), 'MMM dd, yyyy')} • {contract.details.pickupTime}
                  </p>
                </div>
              )}
              
              {contract.status === 'Confirmed' && (
                <button
                  onClick={() => handleCompleteDelivery(contract._id)}
                  className="w-full bg-secondary text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                  <TranslatedText>Complete Delivery & Release Payment</TranslatedText>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyContracts;
