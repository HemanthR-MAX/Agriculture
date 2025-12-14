// client/src/pages/company/Requirements.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, Users, Eye } from 'lucide-react';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';
import { format } from 'date-fns';
import { formatCurrencyDisplay } from '../../utils/formatCurrency';

const RequirementsList = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedReq, setSelectedReq] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFarmersModal, setShowFarmersModal] = useState(false);
  const [farmers, setFarmers] = useState([]);
  
  useEffect(() => {
    fetchRequirements();
  }, []);
  
  const fetchRequirements = async () => {
    try {
      const response = await api.get('/requirements/company');
      setRequirements(response.data.requirements);
    } catch (error) {
      console.error('Error fetching requirements:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMatchedFarmers = async (requirementId) => {
    try {
      const response = await api.get(`/contracts/requirement/${requirementId}`);
      console.log('Matched farmers:', response.data.contracts);
      setFarmers(response.data.contracts);
      setShowFarmersModal(true);
    } catch (error) {
      console.error('Error fetching farmers:', error);
      alert('Error loading farmers');
    }
  };
  
  const filteredRequirements = requirements.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });
  
  if (loading) {
    return <div className="text-center py-12">
      <TranslatedText>Loading...</TranslatedText>
    </div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          <TranslatedText>Requirements</TranslatedText>
        </h1>
        <Link
          to="/company/requirements/new"
          className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <TranslatedText>Post New</TranslatedText>
        </Link>
      </div>
      
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
          onClick={() => setFilter('Active')}
          className={`px-4 py-2 rounded-md transition ${
            filter === 'Active' ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-700'
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
      
      {filteredRequirements.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            <TranslatedText>No requirements found</TranslatedText>
          </p>
          <Link to="/company/requirements/new" className="text-secondary hover:underline">
            <TranslatedText>Post your first requirement</TranslatedText>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredRequirements.map((req) => (
            <div key={req._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{req.demandDetails.cropType}</h3>
                  <p className="text-gray-600">
                    <TranslatedText>Grade</TranslatedText> {req.demandDetails.qualityGrade} • {req.demandDetails.quantity.totalAmount.toLocaleString()} kg
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    req.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                    req.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    <TranslatedText>{req.status}</TranslatedText>
                  </span>
                  <p className="text-2xl font-bold text-secondary mt-2">
                    {formatCurrencyDisplay(req.demandDetails.pricing.offerPrice)}/kg
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Delivery Pattern</TranslatedText>
                  </p>
                  <p className="font-medium">{req.demandDetails.quantity.deliveryPattern}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Timeline</TranslatedText>
                  </p>
                  <p className="font-medium">
                    {format(new Date(req.demandDetails.timeline.startDate), 'MMM dd')} - {format(new Date(req.demandDetails.timeline.endDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Total Cost</TranslatedText>
                  </p>
                  <p className="font-medium text-lg">
                    {formatCurrencyDisplay(req.demandDetails.quantity.totalAmount * req.demandDetails.pricing.offerPrice)}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    <TranslatedText>Fulfillment Status</TranslatedText>
                  </span>
                  <span className="text-sm font-medium">
                    {req.fulfillment.matched.toLocaleString()} / {req.fulfillment.totalRequired.toLocaleString()} kg ({req.fulfillment.percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      req.fulfillment.percentage >= 90 ? 'bg-green-500' :
                      req.fulfillment.percentage >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(req.fulfillment.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setSelectedReq(req);
                    setShowDetailsModal(true);
                  }}
                  className="flex-1 bg-secondary text-white py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <TranslatedText>View Details</TranslatedText>
                </button>
                <button 
                  onClick={() => {
                    setSelectedReq(req);
                    fetchMatchedFarmers(req._id);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <TranslatedText>View Farmers</TranslatedText>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Details Modal */}
      {showDetailsModal && selectedReq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedReq.demandDetails.cropType} - Requirement Details</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Quality Specifications</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <p><strong>Grade:</strong> {selectedReq.demandDetails.qualityGrade}</p>
                    {selectedReq.demandDetails.qualitySpecs.minSize && (
                      <p><strong>Size Range:</strong> {selectedReq.demandDetails.qualitySpecs.minSize}mm - {selectedReq.demandDetails.qualitySpecs.maxSize}mm</p>
                    )}
                    {selectedReq.demandDetails.qualitySpecs.blemishesTolerance && (
                      <p><strong>Blemish Tolerance:</strong> {selectedReq.demandDetails.qualitySpecs.blemishesTolerance}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Quantity Details</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <p><strong>Total Amount:</strong> {selectedReq.demandDetails.quantity.totalAmount.toLocaleString()} kg</p>
                    <p><strong>Delivery Pattern:</strong> {selectedReq.demandDetails.quantity.deliveryPattern}</p>
                    {selectedReq.demandDetails.quantity.dailyAmount && (
                      <>
                        <p><strong>Daily Amount:</strong> {selectedReq.demandDetails.quantity.dailyAmount} kg</p>
                        <p><strong>Duration:</strong> {selectedReq.demandDetails.quantity.duration} days</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Pricing</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <p><strong>Price per kg:</strong> {formatCurrencyDisplay(selectedReq.demandDetails.pricing.offerPrice)}</p>
                    <p><strong>Price Type:</strong> {selectedReq.demandDetails.pricing.priceType}</p>
                    <p><strong>Payment Terms:</strong> {selectedReq.demandDetails.pricing.paymentTerms}</p>
                    <p className="text-lg"><strong>Total Value:</strong> {formatCurrencyDisplay(selectedReq.demandDetails.quantity.totalAmount * selectedReq.demandDetails.pricing.offerPrice)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Logistics</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    {selectedReq.demandDetails.logistics.deliveryLocation.address && (
                      <p><strong>Delivery Location:</strong> {selectedReq.demandDetails.logistics.deliveryLocation.address}</p>
                    )}
                    {selectedReq.demandDetails.logistics.preferredDeliveryTime && (
                      <p><strong>Preferred Time:</strong> {selectedReq.demandDetails.logistics.preferredDeliveryTime}</p>
                    )}
                    <p><strong>Transport:</strong> {selectedReq.demandDetails.logistics.transportArrangement}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Timeline</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <p><strong>Start Date:</strong> {format(new Date(selectedReq.demandDetails.timeline.startDate), 'MMMM dd, yyyy')}</p>
                    <p><strong>End Date:</strong> {format(new Date(selectedReq.demandDetails.timeline.endDate), 'MMMM dd, yyyy')}</p>
                    <p><strong>Flexible:</strong> {selectedReq.demandDetails.timeline.flexible ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowDetailsModal(false)}
                className="mt-6 w-full bg-secondary text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Farmers Modal */}
      {showFarmersModal && selectedReq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Matched Farmers</h2>
                <button 
                  onClick={() => setShowFarmersModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              {farmers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No farmers matched yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {farmers.map((contract) => (
                    <div key={contract._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{contract.farmerId.personalInfo.name}</h3>
                          <p className="text-sm text-gray-600">
                            {contract.farmerId.personalInfo.village}, {contract.farmerId.personalInfo.district}
                          </p>
                          <p className="text-sm text-gray-600">
                            Phone: {contract.farmerId.personalInfo.phone}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          contract.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                          contract.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {contract.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Quantity</p>
                          <p className="font-medium">{contract.details.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Price</p>
                          <p className="font-medium">{formatCurrencyDisplay(contract.details.pricePerKg)}/kg</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total</p>
                          <p className="font-medium">{formatCurrencyDisplay(contract.details.totalAmount)}</p>
                        </div>
                      </div>
                      
                      {contract.details.harvestDates && contract.details.harvestDates.length > 0 && (
                        <div className="mt-3 text-sm">
                          <p className="text-gray-600">
                            Harvest Date: {format(new Date(contract.details.harvestDates[0]), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                      
                      {contract.farmerId.farmInfo && (
                        <div className="mt-3 text-sm text-gray-600">
                          <p>Land: {contract.farmerId.farmInfo.totalLand} acres • Soil: {contract.farmerId.farmInfo.soilType}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => setShowFarmersModal(false)}
                className="mt-6 w-full bg-secondary text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementsList;
