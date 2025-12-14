// client/src/pages/company/PostRequirement.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';

const PostRequirement = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  
  const deliveryPattern = watch('deliveryPattern');
  
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const requirementData = {
        demandDetails: {
          cropType: data.cropType,
          qualityGrade: data.qualityGrade,
          qualitySpecs: {
            minSize: parseFloat(data.minSize) || null,
            maxSize: parseFloat(data.maxSize) || null,
            blemishesTolerance: data.blemishesTolerance
          },
          quantity: {
            totalAmount: parseFloat(data.totalAmount),
            deliveryPattern: data.deliveryPattern,
            dailyAmount: data.deliveryPattern === 'Daily' ? parseFloat(data.dailyAmount) : null,
            duration: data.deliveryPattern === 'Daily' ? parseInt(data.duration) : null
          },
          pricing: {
            offerPrice: parseFloat(data.offerPrice),
            priceType: data.priceType,
            paymentTerms: data.paymentTerms
          },
          logistics: {
            deliveryLocation: {
              address: data.address,
              lat: parseFloat(data.lat) || null,
              lng: parseFloat(data.lng) || null
            },
            preferredDeliveryTime: data.deliveryTime,
            transportArrangement: data.transportArrangement
          },
          timeline: {
            startDate: data.startDate,
            endDate: data.endDate,
            flexible: data.flexible === 'true'
          }
        },
        preferences: {
          minQuantityPerFarmer: parseFloat(data.minQuantityPerFarmer) || 50
        }
      };
      
      const response = await api.post('/requirements', requirementData);
      alert(`Requirement posted successfully! ${response.data.matches?.length || 0} farmers matched.`);
      navigate('/company/requirements');
    } catch (error) {
      alert('Error posting requirement: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        <TranslatedText>Post New Requirement</TranslatedText>
      </h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Crop Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText>Crop Details</TranslatedText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Crop Type</TranslatedText>
              </label>
              <select
                {...register('cropType', { required: true })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Select Crop</option>
                <option value="Tomato">Tomato</option>
                <option value="Onion">Onion</option>
                <option value="Potato">Potato</option>
                <option value="Cabbage">Cabbage</option>
              </select>
              {errors.cropType && <span className="text-red-500 text-sm">Required</span>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Quality Grade</TranslatedText>
              </label>
              <select
                {...register('qualityGrade', { required: true })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Select Grade</option>
                <option value="A">Grade A (Premium)</option>
                <option value="B">Grade B (Standard)</option>
                <option value="C">Grade C (Economy)</option>
                <option value="Any">Any Grade</option>
              </select>
              {errors.qualityGrade && <span className="text-red-500 text-sm">Required</span>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Min Size (mm)</TranslatedText>
              </label>
              <input
                type="number"
                {...register('minSize')}
                className="w-full border rounded-md px-3 py-2"
                placeholder="e.g., 50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Max Size (mm)</TranslatedText>
              </label>
              <input
                type="number"
                {...register('maxSize')}
                className="w-full border rounded-md px-3 py-2"
                placeholder="e.g., 70"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Blemish Tolerance</TranslatedText>
              </label>
              <select
                {...register('blemishesTolerance')}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="None">None</option>
                <option value="Minor">Minor</option>
                <option value="Moderate">Moderate</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Quantity & Delivery */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText>Quantity & Delivery Pattern</TranslatedText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Total Amount (kg)</TranslatedText>
              </label>
              <input
                type="number"
                {...register('totalAmount', { required: true, min: 1 })}
                className="w-full border rounded-md px-3 py-2"
                placeholder="e.g., 30000"
              />
              {errors.totalAmount && <span className="text-red-500 text-sm">Required</span>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Delivery Pattern</TranslatedText>
              </label>
              <select
                {...register('deliveryPattern', { required: true })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Select Pattern</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="One-time">One-time</option>
              </select>
              {errors.deliveryPattern && <span className="text-red-500 text-sm">Required</span>}
            </div>
            
            {deliveryPattern === 'Daily' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TranslatedText>Daily Amount (kg)</TranslatedText>
                  </label>
                  <input
                    type="number"
                    {...register('dailyAmount', { required: deliveryPattern === 'Daily' })}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="e.g., 500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TranslatedText>Duration (days)</TranslatedText>
                  </label>
                  <input
                    type="number"
                    {...register('duration', { required: deliveryPattern === 'Daily' })}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="e.g., 60"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Pricing */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText>Pricing & Payment</TranslatedText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Offer Price (₹/kg)</TranslatedText>
              </label>
              <input
                type="number"
                step="0.01"
                {...register('offerPrice', { required: true, min: 0 })}
                className="w-full border rounded-md px-3 py-2"
                placeholder="e.g., 18"
              />
              {errors.offerPrice && <span className="text-red-500 text-sm">Required</span>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Price Type</TranslatedText>
              </label>
              <select
                {...register('priceType')}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="Fixed">Fixed</option>
                <option value="Market-linked">Market-linked</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Payment Terms</TranslatedText>
              </label>
              <select
                {...register('paymentTerms')}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="Advance 20%, Balance on delivery">20% Advance, 80% on Delivery</option>
                <option value="Full on delivery">Full Payment on Delivery</option>
                <option value="Net 7 days">Net 7 Days</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Logistics */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText>Logistics</TranslatedText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Delivery Address</TranslatedText>
              </label>
              <input
                type="text"
                {...register('address')}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Full address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Preferred Delivery Time</TranslatedText>
              </label>
              <input
                type="text"
                {...register('deliveryTime')}
                className="w-full border rounded-md px-3 py-2"
                placeholder="e.g., 6 AM - 10 AM"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Transport Arrangement</TranslatedText>
              </label>
              <select
                {...register('transportArrangement')}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="Company arranges">Company Arranges Pickup</option>
                <option value="Farmer arranges">Farmer Delivers</option>
                <option value="Platform arranges">Platform Arranges</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText>Timeline</TranslatedText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Start Date</TranslatedText>
              </label>
              <input
                type="date"
                {...register('startDate', { required: true })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.startDate && <span className="text-red-500 text-sm">Required</span>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>End Date</TranslatedText>
              </label>
              <input
                type="date"
                {...register('endDate', { required: true })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.endDate && <span className="text-red-500 text-sm">Required</span>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Flexible Timeline?</TranslatedText>
              </label>
              <select
                {...register('flexible')}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="false">No, strict dates</option>
                <option value="true">Yes, flexible</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Min Quantity per Farmer (kg)</TranslatedText>
              </label>
              <input
                type="number"
                {...register('minQuantityPerFarmer')}
                className="w-full border rounded-md px-3 py-2"
                placeholder="50"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-secondary text-white py-3 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
          >
            <TranslatedText>{loading ? 'Posting...' : 'Post Requirement'}</TranslatedText>
          </button>
          <button
            type="button"
            onClick={() => navigate('/company/requirements')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition"
          >
            <TranslatedText>Cancel</TranslatedText>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostRequirement;
