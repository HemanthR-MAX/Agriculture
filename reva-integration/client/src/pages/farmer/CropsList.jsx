// client/src/pages/farmer/CropsList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sprout } from 'lucide-react';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';

const CropsList = () => {
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

  if (loading) {
    return <div className="text-center py-12">
      <TranslatedText>Loading...</TranslatedText>
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
          <TranslatedText>Add Crop</TranslatedText>
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
          <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{crop.cropDetails.cropType}</h3>
                  {crop.cropDetails.variety && (
                    <p className="text-sm text-gray-600">{crop.cropDetails.variety}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  crop.status === 'Growing' ? 'bg-green-100 text-green-800' :
                  crop.status === 'Harvested' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <TranslatedText>{crop.status}</TranslatedText>
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    <TranslatedText>Area:</TranslatedText>
                  </span>
                  <span className="font-medium">{crop.cropDetails.area} acres</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    <TranslatedText>Planted:</TranslatedText>
                  </span>
                  <span className="font-medium">
                    {new Date(crop.cropDetails.plantingDate).toLocaleDateString()}
                  </span>
                </div>

                {crop.prediction && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      <TranslatedText>Expected Yield:</TranslatedText>
                    </span>
                    <span className="font-medium text-primary">
                      {crop.prediction.expectedYield} kg
                    </span>
                  </div>
                )}

                {crop.allocatedQuantity > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      <TranslatedText>Allocated:</TranslatedText>
                    </span>
                    <span className="font-medium text-secondary">
                      {crop.allocatedQuantity} kg
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropsList;
