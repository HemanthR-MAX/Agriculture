import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';
import CropAnalysisModal from '../../components/CropAnalysisModal';

const AddCrop = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // AUTO GPS
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('lat', position.coords.latitude);
        setValue('lng', position.coords.longitude);
      },
      () => {
        setValue('lat', 18.5204);
        setValue('lng', 73.8567);
      }
    );
  }, [setValue]);

  const analyzeCrop = async (data) => {
    setAnalyzing(true);
    try {
      const res = await api.post('/crops/analyze', {
        cropType: data.cropType,
        variety: data.variety || 'Standard',
        area: parseFloat(data.area),
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
        plantingDate: data.plantingDate
      });
      setAnalysis(res.data);
      setShowModal(true);
    } catch (error) {
      setAnalysis({
        analysis: `**TEST MODE**\nYield: 1,200-1,500kg\nWeather: Sunny 26°C\nSoil: Loamy pH 6.5`,
        weather: { summary: 'Sunny 26°C' },
        soil: { type: 'Loamy', ph: 6.5 },
        confidence: 0.87
      });
      setShowModal(true);
    } finally {
      setAnalyzing(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/crops', {
        cropDetails: {
          cropType: data.cropType,
          variety: data.variety,
          area: parseFloat(data.area),
          plantingDate: data.plantingDate,
          fieldLocation: { lat: parseFloat(data.lat) || null, lng: parseFloat(data.lng) || null }
        },
        cultivation: { seedType: data.seedType, irrigationPlan: data.irrigationPlan }
      });
      alert('✅ Crop added successfully!');
      navigate('/farmer/crops');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-12 text-center">
          🌱 Add New Crop
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 space-y-8 border border-white/50">
          
          {/* CROP TYPE */}
          <div className="space-y-3">
            <label className="block text-xl font-bold text-gray-800">
              Crop Type *
            </label>
            <select 
              {...register('cropType', { required: true })}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-400 text-lg transition-all duration-200 hover:shadow-lg"
            >
              <option value="">🌾 Choose your crop</option>
              <option value="Tomato">🍅 Tomato</option>
              <option value="Onion">🧅 Onion</option>
              <option value="Potato">🥔 Potato</option>
              <option value="Cabbage">🥬 Cabbage</option>
            </select>
            {errors.cropType && <p className="text-red-500 font-semibold">Crop type required</p>}
          </div>

          {/* AREA */}
          <div className="space-y-3">
            <label className="block text-xl font-bold text-gray-800">
              Area (acres) *
            </label>
            <input
              type="number"
              step="0.1"
              {...register('area', { required: true, min: 0.1 })}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-400 text-lg transition-all duration-200 hover:shadow-lg"
              placeholder="0.5"
            />
            {errors.area && <p className="text-red-500 font-semibold">Minimum 0.1 acres</p>}
          </div>

          {/* LOCATION */}
          <div className="space-y-3">
            <label className="block text-xl font-bold text-gray-800">
              📍 Field Location (Auto-detected)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="any"
                {...register('lat')}
                className="p-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 text-lg bg-blue-50/50"
                placeholder="Latitude"
              />
              <input
                type="number"
                step="any"
                {...register('lng')}
                className="p-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 text-lg bg-blue-50/50"
                placeholder="Longitude"
              />
            </div>
            <p className="text-green-600 font-semibold text-sm bg-green-100 p-3 rounded-xl">
              🔄 Auto-detects GPS • Baramati default (18.52, 73.86)
            </p>
          </div>

          {/* PLANTING DATE */}
          <div className="space-y-3">
            <label className="block text-xl font-bold text-gray-800">
              Planting Date *
            </label>
            <input
              type="date"
              {...register('plantingDate', { required: true })}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-400 text-lg transition-all duration-200 hover:shadow-lg"
            />
            {errors.plantingDate && <p className="text-red-500 font-semibold">Date required</p>}
          </div>

          {/* AI ANALYSIS BUTTON */}
          <button
            type="button"
            onClick={handleSubmit(analyzeCrop)}
            disabled={analyzing || !watch('cropType')}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-6 px-8 rounded-3xl text-xl font-bold shadow-2xl hover:from-emerald-600 hover:to-green-700 hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? '🤖 AI Analyzing...' : '🚀 GET AI CROP ANALYSIS'}
          </button>

          {/* SUBMIT BUTTONS */}
          <div className="grid grid-cols-2 gap-6 pt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6 px-8 rounded-3xl text-xl font-bold shadow-2xl hover:from-blue-600 hover:to-blue-700 hover:shadow-3xl transition-all duration-300 disabled:opacity-50"
            >
              {loading ? '⏳ Adding...' : '✅ ADD CROP'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/farmer/crops')}
              className="bg-gradient-to-r from-gray-400 to-gray-500 text-white py-6 px-8 rounded-3xl text-xl font-bold shadow-2xl hover:from-gray-500 hover:to-gray-600 hover:shadow-3xl transition-all duration-300"
            >
              ❌ Cancel
            </button>
          </div>
        </form>

        {showModal && analysis && (
          <CropAnalysisModal analysis={analysis} onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

export default AddCrop;
