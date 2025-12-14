// client/src/pages/company/AddRequirement.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';

const AddRequirement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cropType: 'Tomato',
    qualityGrade: 'B',
    totalAmount: '',
    deliveryPattern: 'Bulk',
    dailyAmount: '',
    duration: '',
    offerPrice: '',
    priceType: 'Fixed',
    paymentTerms: '20% advance, 80% on delivery',
    startDate: '',
    endDate: '',
    flexible: false,
    deliveryAddress: '',
    preferredDeliveryTime: 'Morning (6-10 AM)',
    transportArrangement: 'Company arranged',
    minSize: '',
    maxSize: '',
    blemishesTolerance: 'Low'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requirementData = {
        demandDetails: {
          cropType: formData.cropType,
          qualityGrade: formData.qualityGrade,
          qualitySpecs: {
            minSize: formData.minSize || undefined,
            maxSize: formData.maxSize || undefined,
            blemishesTolerance: formData.blemishesTolerance
          },
          quantity: {
            totalAmount: parseInt(formData.totalAmount),
            deliveryPattern: formData.deliveryPattern,
            dailyAmount: formData.deliveryPattern === 'Daily' ? parseInt(formData.dailyAmount) : undefined,
            duration: formData.deliveryPattern === 'Daily' ? parseInt(formData.duration) : undefined
          },
          pricing: {
            offerPrice: parseFloat(formData.offerPrice),
            priceType: formData.priceType,
            paymentTerms: formData.paymentTerms
          },
          timeline: {
            startDate: formData.startDate,
            endDate: formData.endDate,
            flexible: formData.flexible
          },
          logistics: {
            deliveryLocation: {
              address: formData.deliveryAddress
            },
            preferredDeliveryTime: formData.preferredDeliveryTime,
            transportArrangement: formData.transportArrangement
          }
        }
      };

      await api.post('/requirements', requirementData);
      alert('Requirement posted successfully!');
      navigate('/company/requirements');
    } catch (error) {
      console.error('Error posting requirement:', error);
      alert('Error posting requirement: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-secondary" />
        <h1 className="text-3xl font-bold text-gray-900">
          <TranslatedText>Post New Requirement</TranslatedText>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Crop Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText>Crop Details</TranslatedText>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <TranslatedText>Crop Type</TranslatedText>
              </label>
              <select
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                required
              >
                <option value="Tomato">Tomato</option>
                <option value="Onion">Onion</option>
                <option value="Potato">Potato</option>
                <option value="Cabbage">Cabbage</option>
                <option value="Carrot">Carrot</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <TranslatedText>Quality Grade</TranslatedText>
              </label>
              <select
                name="qualityGrade"
                value={formData.qualityGrade}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                required
              >
                <option value="A">Grade A (Premium)</option>
                <option value="B">Grade B (Standard)</option>
                <option value="C">Grade C (Basic)</option>
                <option value="Any">Any Grade</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <TranslatedText>Min Size (mm)</TranslatedText>
              </label>
              <input
                type="number"
                name="minSize"
                value={formData.minSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <TranslatedText>Max Size (mm)</TranslatedText>
              </label>
              <input
                type="number"
                name="maxSize"
                value={formData.maxSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        {/* Quantity Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText>Quantity Requirements</TranslatedText>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <TranslatedText>Total Quantity (kg)</TranslatedText>
              </label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <TranslatedText>Delivery Pattern</TranslatedText>
              </label>
              <select
                name="deliveryPattern"
                value={formData.deliveryPattern}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                required
              >
                <option value="Bulk">Bulk (One-time)</option>
                <option value="Daily">Daily Delivery</option>
                <option value="Weekly">Weekly Delivery</option>
              </select>
            </div>

            {formData.deliveryPattern === 'Daily' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <TranslatedText>Daily Amount (kg)</TranslatedText>
                  </label>
                  <input
                    type="number"
                    name="dailyAmount"
                    value={formData.dailyAmount}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <TranslatedText>Duration (days)</TranslatedText>
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText>Pricing</TranslatedText>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <TranslatedText>Offer Price (₹/kg)</TranslatedText>
              </label>
              <input
                type="number"
                step="0.01"
                name="offerPrice"
                value={formData.offerPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <TranslatedText>Price Type</TranslatedText>
              </label>
              <select
                name="priceType"
                value={formData.priceType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
              >
                <option value="Fixed">Fixed Price</option>
                <option value="Market-linked">Market Linked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText>Timeline</TranslatedText>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <TranslatedText>Start Date</TranslatedText>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <TranslatedText>End Date</TranslatedText>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="flexible"
                checked={formData.flexible}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium">
                <TranslatedText>Flexible Timeline</TranslatedText>
              </label>
            </div>
          </div>
        </div>

        {/* Logistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText>Logistics</TranslatedText>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <TranslatedText>Delivery Address</TranslatedText>
              </label>
              <textarea
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <TranslatedText>Preferred Delivery Time</TranslatedText>
                </label>
                <select
                  name="preferredDeliveryTime"
                  value={formData.preferredDeliveryTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                >
                  <option value="Morning (6-10 AM)">Morning (6-10 AM)</option>
                  <option value="Afternoon (10-2 PM)">Afternoon (10-2 PM)</option>
                  <option value="Evening (2-6 PM)">Evening (2-6 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <TranslatedText>Transport</TranslatedText>
                </label>
                <select
                  name="transportArrangement"
                  value={formData.transportArrangement}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                >
                  <option value="Company arranged">Company Arranged</option>
                  <option value="Farmer arranged">Farmer Arranged</option>
                  <option value="Shared">Shared</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-secondary text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? 'Posting...' : <TranslatedText>Post Requirement</TranslatedText>}
          </button>
          <button
            type="button"
            onClick={() => navigate('/company/requirements')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            <TranslatedText>Cancel</TranslatedText>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRequirement;
