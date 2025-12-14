import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';
import TranslatedText from '../../components/TranslatedText';

const FarmerRegister = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  
  const pin = watch('pin');

  const onSubmit = async (data) => {
    setLoading(true);
    
    const safeNumber = (val) => (val && !isNaN(val) ? parseFloat(val) : 0);

    try {
      // Construct payload
      const payload = {
        phone: data.phone,
        pin: data.pin,
        personalInfo: {
          name: data.name,
          village: data.village,
          district: data.district,
          state: data.state,
          language: data.language
        },
        farmInfo: {
          totalLand: safeNumber(data.totalLand),
          soilType: data.soilType || '',
          irrigationType: data.irrigationType || ''
          // Note: We intentionally omit gpsLocation here to avoid null issues
          // if you aren't collecting lat/lng in the form yet.
        },
        bankDetails: {
          accountNumber: data.accountNumber || '',
          ifscCode: data.ifscCode || '',
          accountHolderName: data.accountHolderName || '',
          upiId: data.upiId || ''
        }
      };

      console.log('Sending Payload:', payload);

      const response = await axios.post('http://localhost:5000/api/auth/farmer/register', payload);
      
      login(response.data.farmer, response.data.token);
      alert('Registration successful!');
      navigate('/farmer');
      
    } catch (error) {
      console.error('Registration Error:', error.response?.data);
      alert('Registration failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          <TranslatedText>Farmer Registration</TranslatedText>
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
          
          {/* Section 1: Account Information (Phone & PIN) */}
          <div className="bg-green-50 p-4 rounded-md border border-green-100">
            <h2 className="text-xl font-semibold mb-4 text-green-800">
              <TranslatedText>Account Credentials</TranslatedText>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Phone Number</TranslatedText>
                </label>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit number'
                    }
                  })}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary"
                  placeholder="Enter 10-digit mobile number"
                />
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Create 6-Digit PIN</TranslatedText>
                </label>
                <input
                  type="password"
                  {...register('pin', { 
                    required: 'PIN is required',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'PIN must be exactly 6 digits'
                    }
                  })}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary"
                  maxLength="6"
                  placeholder="******"
                />
                {errors.pin && <span className="text-red-500 text-sm">{errors.pin.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Confirm PIN</TranslatedText>
                </label>
                <input
                  type="password"
                  {...register('confirmPin', { 
                    required: 'Please confirm your PIN',
                    validate: value => value === pin || "PINs do not match"
                  })}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary"
                  maxLength="6"
                  placeholder="******"
                />
                {errors.confirmPin && <span className="text-red-500 text-sm">{errors.confirmPin.message}</span>}
              </div>
            </div>
          </div>

          {/* Section 2: Personal Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              <TranslatedText>Personal Information</TranslatedText>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Full Name</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('name', { required: true })}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.name && <span className="text-red-500 text-sm">Name is required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Village</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('village', { required: true })}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.village && <span className="text-red-500 text-sm">Village is required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>District</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('district', { required: true })}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.district && <span className="text-red-500 text-sm">District is required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>State</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('state', { required: true })}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.state && <span className="text-red-500 text-sm">State is required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Preferred Language</TranslatedText>
                </label>
                <select
                  {...register('language', { required: true })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="English">English</option>
                  <option value="Kannada">ಕನ್ನಡ</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Section 3: Farm Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              <TranslatedText>Farm Information</TranslatedText>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Total Land (acres)</TranslatedText>
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('totalLand')}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Soil Type</TranslatedText>
                </label>
                <select
                  {...register('soilType')}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select</option>
                  <option value="Clay">Clay</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Black">Black</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Irrigation Type</TranslatedText>
                </label>
                <select
                  {...register('irrigationType')}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select</option>
                  <option value="Drip">Drip</option>
                  <option value="Flood">Flood</option>
                  <option value="Rainfed">Rainfed</option>
                  <option value="Sprinkler">Sprinkler</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Section 4: Bank Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              <TranslatedText>Bank Details</TranslatedText>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Account Number</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('accountNumber')}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>IFSC Code</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('ifscCode')}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Account Holder Name</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('accountHolderName')}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>UPI ID (Optional)</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('upiId')}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-md hover:bg-green-600 transition disabled:opacity-50 font-bold text-lg"
            >
              <TranslatedText>{loading ? 'Registering...' : 'Complete Registration'}</TranslatedText>
            </button>
            
            <div className="text-center text-sm text-gray-600">
               <TranslatedText>Already have an account?</TranslatedText>{' '}
               <Link to="/farmer/login" className="text-primary hover:underline font-bold">
                 <TranslatedText>Login Here</TranslatedText>
               </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerRegister;
