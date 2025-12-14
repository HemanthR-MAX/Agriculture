// client/src/pages/farmer/CropManagement.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, TrendingUp } from 'lucide-react';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';
import { format } from 'date-fns';

const CropManagement = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    fetchCrops();
  }, []);
  
  const fetchCrops = async () => {
    try {
      const response = await api.get('/crops/farmer');
      setCrops(response.data.crops);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredCrops = crops.filter(crop => {
    if (filter === 'all') return true;
    return crop.status === filter;
  });
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Growing': return 'bg-yellow-100 text-yellow-800';
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Harvested': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const calculateDaysToHarvest = (expectedHarvestDate) => {
    const today = new Date();
    const harvest = new Date(expectedHarvestDate);
    const diffTime = harvest - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  if (loading) {
    return <div className="text-center py-12">
      <TranslatedText>Loading crops...</TranslatedText>
    </div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          <TranslatedText>My Crops</TranslatedText>
        </h1>
        <Link
          to="/farmer/crops/add"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <TranslatedText>Add New Crop</TranslatedText>
        </Link>
      </div>
      
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
          onClick={() => setFilter('Growing')}
          className={`px-4 py-2 rounded-md transition ${
            filter === 'Growing' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <TranslatedText>Growing</TranslatedText>
        </button>
        <button
          onClick={() => setFilter('Ready')}
          className={`px-4 py-2 rounded-md transition ${
            filter === 'Ready' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <TranslatedText>Ready</TranslatedText>
        </button>
        <button
          onClick={() => setFilter('Harvested')}
          className={`px-4 py-2 rounded-md transition ${
            filter === 'Harvested' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <TranslatedText>Harvested</TranslatedText>
        </button>
      </div>
      
      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">
            <TranslatedText>No crops found</TranslatedText>
          </p>
          <Link to="/farmer/crops/add" className="text-primary hover:underline">
            <TranslatedText>Add your first crop</TranslatedText>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <Link
              key={crop._id}
              to={`/farmer/crops/${crop._id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 block"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {crop.cropDetails.cropType}
                  </h3>
                  {crop.cropDetails.variety && (
                    <p className="text-sm text-gray-600">{crop.cropDetails.variety}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(crop.status)}`}>
                  <TranslatedText>{crop.status}</TranslatedText>
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    <TranslatedText>Planted:</TranslatedText> {format(new Date(crop.cropDetails.plantingDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                
                {crop.cropDetails.expectedHarvestDate && crop.status === 'Growing' && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      <TranslatedText>Harvest in:</TranslatedText> {calculateDaysToHarvest(crop.cropDetails.expectedHarvestDate)} <TranslatedText>days</TranslatedText>
                    </span>
                  </div>
                )}
              </div>
              
              {crop.prediction && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      <TranslatedText>Expected Yield</TranslatedText>
                    </span>
                    <span className="font-semibold">{crop.prediction.expectedYield} kg</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      <TranslatedText>Allocated</TranslatedText>
                    </span>
                    <span className="font-semibold">{crop.allocatedQuantity || 0} kg</span>
                  </div>
                  
                  {crop.prediction.confidence && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span><TranslatedText>Confidence</TranslatedText></span>
                        <span>{Math.round(crop.prediction.confidence * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${crop.prediction.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4">
                <span className="text-primary text-sm hover:underline">
                  <TranslatedText>View Details →</TranslatedText>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropManagement;
