// client/src/pages/farmer/Contracts.jsx
import { useEffect, useState } from 'react';
import { FileText, Calendar, MapPin, CheckCircle, Eye } from 'lucide-react';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';
import { format } from 'date-fns';
import { formatCurrencyDisplay } from '../../utils/formatCurrency';

const FarmerContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  useEffect(() => {
    fetchContracts();
  }, []);
  
  const fetchContracts = async () => {
    try {
      const response = await api.get('/contracts/farmer');
      console.log('Farmer contracts:', response.data.contracts);
      setContracts(response.data.contracts);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAcceptContract = async (contractId) => {
    const confirmed = window.confirm('Do you want to accept this contract?');
    if (!confirmed) return;
    
    try {
      await api.post(`/contracts/${contractId}/confirm`);
      alert('Contract accepted successfully!');
      fetchContracts();
    } catch (error) {
      alert('Error accepting contract: ' + (error.response?.data?.message || error.message));
    }
  };
  
  const filteredContracts = contracts.filter(contract => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['Pending', 'Confirmed'].includes(contract.status);
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
        <TranslatedText>My Contracts</TranslatedText>
      </h1>
      
      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md transition ${
            filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <TranslatedText>All</TranslatedText>
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-md transition ${
            filter === 'active' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <TranslatedText>Active</TranslatedText>
        </button>
        <button
          onClick={() => setFilter('Pending')}
          className={`px-4 py-2 rounded-md transition ${
            filter === 'Pending' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <TranslatedText>Pending</TranslatedText>
        </button>
        <button
          onClick={() => setFilter('Completed')}
          className={`px-4 py-2 rounded-md transition ${
            filter === 'Completed' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <TranslatedText>Completed</TranslatedText>
        </button>
      </div>
      
      {/* Contracts List */}
      {filteredContracts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            <TranslatedText>No contracts found</TranslatedText>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            <TranslatedText>Add crops to get matched with buyers</TranslatedText>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContracts.map((contract) => (
            <div key={contract._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {contract.companyId?.companyInfo?.companyName || 'Company'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {contract.companyId?.companyInfo?.address?.city}, {contract.companyId?.companyInfo?.address?.state}
                  </p>
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Contact:</TranslatedText> {contract.companyId?.contactPerson?.name}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  contract.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  contract.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                  contract.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
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
                    <TranslatedText>Total Amount</TranslatedText>
                  </p>
                  <p className="font-medium text-lg text-primary">{formatCurrencyDisplay(contract.details.totalAmount)}</p>
                </div>
              </div>
              
              {contract.details.harvestDates && contract.details.harvestDates.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>
                    <TranslatedText>Scheduled Pickup:</TranslatedText> {format(new Date(contract.details.harvestDates[0]), 'MMM dd, yyyy')} • {contract.details.pickupTime}
                  </span>
                </div>
              )}
              
              {contract.details.deliveryLocation?.address && (
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mt-1" />
                  <span>
                    <TranslatedText>Delivery:</TranslatedText> {contract.details.deliveryLocation.address}
                  </span>
                </div>
              )}
              
              {/* Payment Info */}
              <div className="bg-green-50 rounded-md p-4 mb-4">
                <h4 className="font-semibold text-sm mb-2">
                  <TranslatedText>Payment Details</TranslatedText>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">
                      <TranslatedText>Advance (20%)</TranslatedText>
                    </p>
                    <p className="font-medium">
                      {formatCurrencyDisplay(contract.payment.advanceAmount)}
                      {contract.payment.advancePaid ? ' ✓' : ' (Pending)'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <TranslatedText>Balance (80%)</TranslatedText>
                    </p>
                    <p className="font-medium">
                      {formatCurrencyDisplay(contract.payment.balanceAmount)}
                      {contract.payment.balancePaid ? ' ✓' : ' (On Delivery)'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                {contract.status === 'Pending' && (
                  <button
                    onClick={() => handleAcceptContract(contract._id)}
                    className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-green-600 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <TranslatedText>Accept Contract</TranslatedText>
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setSelectedContract(contract);
                    setShowDetailsModal(true);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <TranslatedText>View Details</TranslatedText>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Details Modal */}
      {showDetailsModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Contract Details</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Company Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <p><strong>Company:</strong> {selectedContract.companyId?.companyInfo?.companyName}</p>
                    <p><strong>Contact Person:</strong> {selectedContract.companyId?.contactPerson?.name}</p>
                    <p><strong>Email:</strong> {selectedContract.companyId?.contactPerson?.email}</p>
                    <p><strong>Phone:</strong> {selectedContract.companyId?.contactPerson?.phone}</p>
                    {selectedContract.companyId?.companyInfo?.address && (
                      <p><strong>Address:</strong> {selectedContract.companyId.companyInfo.address.street}, {selectedContract.companyId.companyInfo.address.city}, {selectedContract.companyId.companyInfo.address.state} - {selectedContract.companyId.companyInfo.address.pincode}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Contract Details</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <p><strong>Crop Type:</strong> {selectedContract.details.cropType}</p>
                    <p><strong>Quality Grade:</strong> {selectedContract.details.qualityGrade}</p>
                    <p><strong>Quantity:</strong> {selectedContract.details.quantity} kg</p>
                    <p><strong>Price per kg:</strong> {formatCurrencyDisplay(selectedContract.details.pricePerKg)}</p>
                    <p className="text-lg"><strong>Total Amount:</strong> {formatCurrencyDisplay(selectedContract.details.totalAmount)}</p>
                  </div>
                </div>
                
                {selectedContract.cropId && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Crop Information</h3>
                    <div className="bg-gray-50 p-4 rounded-md space-y-2">
                      {selectedContract.cropId.cropDetails?.variety && (
                        <p><strong>Variety:</strong> {selectedContract.cropId.cropDetails.variety}</p>
                      )}
                      <p><strong>Area:</strong> {selectedContract.cropId.cropDetails?.area} acres</p>
                      <p><strong>Planting Date:</strong> {format(new Date(selectedContract.cropId.cropDetails?.plantingDate), 'MMM dd, yyyy')}</p>
                      {selectedContract.cropId.prediction && (
                        <p><strong>Expected Yield:</strong> {selectedContract.cropId.prediction.expectedYield} kg</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Delivery Details</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    {selectedContract.details.harvestDates && selectedContract.details.harvestDates.length > 0 && (
                      <p><strong>Harvest Date:</strong> {format(new Date(selectedContract.details.harvestDates[0]), 'MMMM dd, yyyy')}</p>
                    )}
                    <p><strong>Pickup Time:</strong> {selectedContract.details.pickupTime}</p>
                    {selectedContract.details.deliveryLocation?.address && (
                      <p><strong>Delivery Location:</strong> {selectedContract.details.deliveryLocation.address}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Payment Terms</h3>
                  <div className="bg-green-50 p-4 rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span>Advance Payment (20%):</span>
                      <span className="font-semibold">
                        {formatCurrencyDisplay(selectedContract.payment.advanceAmount)}
                        {selectedContract.payment.advancePaid && ' ✓ Paid'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Balance Payment (80%):</span>
                      <span className="font-semibold">
                        {formatCurrencyDisplay(selectedContract.payment.balanceAmount)}
                        {selectedContract.payment.balancePaid ? ' ✓ Paid' : ' (On Delivery)'}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between text-lg">
                      <span>Total:</span>
                      <span className="font-bold">{formatCurrencyDisplay(selectedContract.details.totalAmount)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Platform Fee (2%): {formatCurrencyDisplay(selectedContract.payment.platformFee)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Contract Status</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedContract.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedContract.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      selectedContract.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedContract.status}
                    </span>
                    {selectedContract.status === 'Pending' && (
                      <p className="text-sm text-gray-600 mt-2">
                        Please review and accept this contract to proceed.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                {selectedContract.status === 'Pending' && (
                  <button
                    onClick={() => {
                      handleAcceptContract(selectedContract._id);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-green-600 transition"
                  >
                    Accept Contract
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerContracts;
