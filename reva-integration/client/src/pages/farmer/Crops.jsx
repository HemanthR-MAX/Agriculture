import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';

const Crops = () => {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = api.get('/crops');
      setCrops(res.data.crops);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            🌾 My Crops
          </h1>
          <button
            onClick={() => navigate('/farmer/add-crop')}
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-12 py-6 rounded-3xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            ➕ Add New Crop
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {crops.map((crop) => (
            <div key={crop._id} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
              {/* CROP HEADER */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
                  {crop.cropDetails.cropType === 'Tomato' ? '🍅' : 
                   crop.cropDetails.cropType === 'Onion' ? '🧅' : 
                   crop.cropDetails.cropType === 'Potato' ? '🥔' : '🥬'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{crop.cropDetails.cropType}</h3>
                  <p className="text-green-600 font-semibold">{crop.cropDetails.variety || 'Standard'}</p>
                </div>
              </div>

              {/* PROGRESS */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Days to Harvest</span>
                  <span>{Math.round((new Date(crop.cropDetails.expectedHarvestDate) - Date.now()) / (1000*60*60*24))} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full" 
                       style={{width: '65%'}}></div>
                </div>
              </div>

              {/* QUALITY PREDICTION - PRD EXACT */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-r from-yellow-50 to-green-50 rounded-2xl border-4 border-yellow-200">
                <div className="text-center p-4 bg-yellow-100 rounded-xl hover:bg-yellow-200 transition">
                  <div className="text-3xl font-bold text-yellow-700">{crop.prediction?.qualityDistribution?.gradeA || 35}%</div>
                  <div className="text-xs font-semibold text-yellow-800 mt-1">Grade A</div>
                  <div className="text-xs text-yellow-600">25-35₹/kg</div>
                </div>
                
                <div className="text-center p-4 bg-green-100 rounded-xl border-4 border-green-400 shadow-lg hover:shadow-xl transition">
                  <div className="text-3xl font-bold text-green-700">{crop.prediction?.qualityDistribution?.gradeB || 42}%</div>
                  <div className="text-xs font-bold text-green-800 mt-1">Grade B ★ RECOMMENDED</div>
                  <div className="text-xs text-green-600">15-22₹/kg</div>
                </div>
                
                <div className="text-center p-4 bg-red-100 rounded-xl hover:bg-red-200 transition">
                  <div className="text-3xl font-bold text-red-700">{crop.prediction?.qualityDistribution?.gradeC || 23}%</div>
                  <div className="text-xs font-semibold text-red-800 mt-1">Grade C</div>
                  <div className="text-xs text-red-600">8-12₹/kg</div>
                </div>
              </div>

              {/* YIELD PREDICTION */}
              <div className="bg-blue-50 p-6 rounded-2xl mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-blue-800">Expected Yield</span>
                  <span className="text-2xl font-bold text-blue-600">{crop.prediction?.expectedYield || 1350}kg</span>
                </div>
                <div className="text-sm text-blue-700 bg-blue-100 inline-block px-4 py-2 rounded-full">
                  Confidence: {(crop.prediction?.confidence * 100 || 87).toFixed(0)}%
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-orange-600 hover:to-orange-700 shadow-xl transition-all duration-300">
                  📈 Update Progress
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-purple-600 hover:to-purple-700 shadow-xl transition-all duration-300">
                  📋 View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {crops.length === 0 && (
          <div className="text-center py-32">
            <div className="text-8xl mb-8">🌱</div>
            <h2 className="text-4xl font-bold text-gray-600 mb-6">No crops yet</h2>
            <p className="text-xl text-gray-500 mb-12">Add your first crop to get AI predictions and contract matches</p>
            <button
              onClick={() => navigate('/farmer/add-crop')}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-16 py-8 rounded-3xl text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              🚀 Add First Crop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crops;
