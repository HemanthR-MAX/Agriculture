// client/src/pages/farmer/CropDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Droplet, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';
import { format } from 'date-fns';

const CropDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState({
    health: 'Good',
    pestIssues: false,
    weatherImpact: 'No issues'
  });
  
  useEffect(() => {
    fetchCropDetails();
  }, [id]);
  
  const fetchCropDetails = async () => {
    try {
      const [cropRes, contractsRes] = await Promise.all([
        api.get(`/crops/${id}`),
        api.get('/contracts/farmer')
      ]);
      
      setCrop(cropRes.data.crop);
      setContracts(contractsRes.data.contracts.filter(c => c.cropId._id === id));
    } catch (error) {
      console.error('Error fetching crop details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/crops/${id}/progress`, updateData);
      alert('Progress updated successfully!');
      setShowUpdateForm(false);
      fetchCropDetails();
    } catch (error) {
      alert('Error updating progress: ' + error.message);
    }
  };
  
  if (loading) {
    return <div className="text-center py-12">
      <TranslatedText>Loading...</TranslatedText>
    </div>;
  }
  
  if (!crop) {
    return <div className="text-center py-12">
      <TranslatedText>Crop not found</TranslatedText>
    </div>;
  }
  
  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/farmer/crops')}
        className="text-primary hover:underline mb-4"
      >
        ← <TranslatedText>Back to Crops</TranslatedText>
      </button>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{crop.cropDetails.cropType}</h1>
            {crop.cropDetails.variety && (
              <p className="text-gray-600">{crop.cropDetails.variety}</p>
            )}
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            crop.status === 'Growing' ? 'bg-yellow-100 text-yellow-800' :
            crop.status === 'Ready' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            <TranslatedText>{crop.status}</TranslatedText>
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crop Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              <TranslatedText>Crop Information</TranslatedText>
            </h2>
            
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">
                  <TranslatedText>Planting Date</TranslatedText>
                </p>
                <p className="font-medium">{format(new Date(crop.cropDetails.plantingDate), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            
            {crop.cropDetails.expectedHarvestDate && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Expected Harvest</TranslatedText>
                  </p>
                  <p className="font-medium">{format(new Date(crop.cropDetails.expectedHarvestDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">
                  <TranslatedText>Area</TranslatedText>
                </p>
                <p className="font-medium">{crop.cropDetails.area} <TranslatedText>acres</TranslatedText></p>
              </div>
            </div>
            
            {crop.cultivation?.seedType && (
              <div className="flex items-start gap-3">
                <Droplet className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Seed Type</TranslatedText>
                  </p>
                  <p className="font-medium">{crop.cultivation.seedType}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Yield Prediction */}
          {crop.prediction && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                <TranslatedText>Yield Prediction</TranslatedText>
              </h2>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-sm text-gray-600">
                    <TranslatedText>Expected Yield</TranslatedText>
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{crop.prediction.expectedYield} kg</p>
                <p className="text-sm text-gray-600 mt-1">
                  <TranslatedText>Confidence:</TranslatedText> {Math.round(crop.prediction.confidence * 100)}%
                </p>
              </div>
              
              {crop.prediction.qualityDistribution && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <TranslatedText>Quality Forecast</TranslatedText>
                  </p>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span><TranslatedText>Grade A</TranslatedText></span>
                        <span>{Math.round(crop.prediction.qualityDistribution.gradeA * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${crop.prediction.qualityDistribution.gradeA * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span><TranslatedText>Grade B</TranslatedText></span>
                        <span>{Math.round(crop.prediction.qualityDistribution.gradeB * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${crop.prediction.qualityDistribution.gradeB * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span><TranslatedText>Grade C</TranslatedText></span>
                        <span>{Math.round(crop.prediction.qualityDistribution.gradeC * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${crop.prediction.qualityDistribution.gradeC * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {crop.prediction?.pricePrediction && (
  <div className="bg-white rounded-lg shadow p-6 mt-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <TrendingUp className="w-6 h-6 text-secondary" />
      <TranslatedText>Price Prediction</TranslatedText>
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">
          <TranslatedText>Predicted Price at Harvest</TranslatedText>
        </p>
        <p className="text-3xl font-bold text-secondary">
          ₹{crop.prediction.pricePrediction.predictedPrice}/kg
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <TranslatedText>Confidence:</TranslatedText> {Math.round(crop.prediction.pricePrediction.confidence * 100)}%
        </p>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">
          <TranslatedText>Expected Revenue</TranslatedText>
        </p>
        <p className="text-3xl font-bold text-primary">
          ₹{(crop.prediction.expectedYield * crop.prediction.pricePrediction.predictedPrice).toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <TranslatedText>Price Range:</TranslatedText> ₹{crop.prediction.pricePrediction.priceRange.min} - ₹{crop.prediction.pricePrediction.priceRange.max}/kg
        </p>
      </div>
    </div>
    
    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
      <p className="font-semibold mb-2">
        <TranslatedText>Market Analysis</TranslatedText>
      </p>
      <div className="space-y-1 text-sm">
        <p><strong><TranslatedText>Season:</TranslatedText></strong> {crop.prediction.pricePrediction.season}</p>
        <p><strong><TranslatedText>Market Trend:</TranslatedText></strong> {crop.prediction.pricePrediction.analysis.trend}</p>
        <p><strong><TranslatedText>Recommendation:</TranslatedText></strong> {crop.prediction.pricePrediction.analysis.recommendation}</p>
      </div>
    </div>
  </div>
)}

{crop.prediction?.weatherImpact && (
  <div className="bg-white rounded-lg shadow p-6 mt-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Cloud className="w-6 h-6 text-blue-500" />
      <TranslatedText>Weather Impact</TranslatedText>
    </h2>
    
    <div className="bg-blue-50 p-4 rounded-lg">
      <p className="text-lg font-semibold">
        {crop.prediction.weatherImpact.description} <TranslatedText>Conditions</TranslatedText>
      </p>
      <p className="text-sm text-gray-600 mt-2">
        <TranslatedText>Weather impact on yield:</TranslatedText> {crop.prediction.weatherImpact.factor > 1 ? '+' : ''}{Math.round((crop.prediction.weatherImpact.factor - 1) * 100)}%
      </p>
    </div>
  </div>
)}
        </div>
      </div>
      
      {/* Contracts */}
      {contracts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText>Contracts</TranslatedText>
          </h2>
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div key={contract._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{contract.companyId.companyInfo.companyName}</h3>
                    <p className="text-sm text-gray-600">
                      {contract.details.quantity} kg × ₹{contract.details.pricePerKg} = ₹{contract.details.totalAmount}
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
                
                {contract.details.harvestDates && contract.details.harvestDates.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Harvest Date:</TranslatedText> {format(new Date(contract.details.harvestDates[0]), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Update Progress */}
      {crop.status === 'Growing' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              <TranslatedText>Progress Updates</TranslatedText>
            </h2>
            <button
              onClick={() => setShowUpdateForm(!showUpdateForm)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              <TranslatedText>{showUpdateForm ? 'Cancel' : 'Update Progress'}</TranslatedText>
            </button>
          </div>
          
          {showUpdateForm && (
            <form onSubmit={handleUpdateProgress} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Plant Health</TranslatedText>
                </label>
                <select
                  value={updateData.health}
                  onChange={(e) => setUpdateData({ ...updateData, health: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="Good">Good</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={updateData.pestIssues}
                    onChange={(e) => setUpdateData({ ...updateData, pestIssues: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    <TranslatedText>Pest Issues</TranslatedText>
                  </span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Weather Impact</TranslatedText>
                </label>
                <select
                  value={updateData.weatherImpact}
                  onChange={(e) => setUpdateData({ ...updateData, weatherImpact: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="No issues">No issues</option>
                  <option value="Some damage">Some damage</option>
                  <option value="Major damage">Major damage</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-green-600 transition"
              >
                <TranslatedText>Submit Update</TranslatedText>
              </button>
            </form>
          )}
          
          {crop.progressUpdates && crop.progressUpdates.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">
                <TranslatedText>Previous Updates</TranslatedText>
              </h3>
              {crop.progressUpdates.slice().reverse().map((update, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 py-2">
                  <p className="text-sm text-gray-600">
                    {format(new Date(update.date), 'MMM dd, yyyy')}
                  </p>
                  <p className="font-medium">
                    <TranslatedText>Health:</TranslatedText> {update.health}
                  </p>
                  {update.pestIssues && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      <TranslatedText>Pest issues reported</TranslatedText>
                    </p>
                  )}
                  {update.weatherImpact !== 'No issues' && (
                    <p className="text-sm text-orange-600">
                      <TranslatedText>Weather impact:</TranslatedText> {update.weatherImpact}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CropDetails;
