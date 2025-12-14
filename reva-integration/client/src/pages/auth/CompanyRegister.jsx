// client/src/pages/auth/CompanyRegister.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import TranslatedText from '../../components/TranslatedText';

const CompanyRegister = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  
  const password = watch('password');
  
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/company/register', {
        companyInfo: {
          companyName: data.companyName,
          registrationNumber: data.registrationNumber,
          companyType: data.companyType,
          gstNumber: data.gstNumber,
          address: {
            street: data.street,
            city: data.city,
            state: data.state,
            pincode: data.pincode
          }
        },
        contactPerson: {
          name: data.contactName,
          designation: data.designation,
          email: data.email,
          phone: data.phone
        },
        processingCapacity: {
          dailyCapacity: parseFloat(data.dailyCapacity),
          storageCapacity: parseFloat(data.storageCapacity)
        },
        password: data.password
      });
      
      alert('Registration successful! Please wait for admin verification.');
      navigate('/company/login');
    } catch (error) {
      alert('Registration failed: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          <TranslatedText>Company Registration</TranslatedText>
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Company Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              <TranslatedText>Company Information</TranslatedText>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Company Name</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('companyName', { required: true })}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.companyName && <span className="text-red-500 text-sm">Required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Registration Number</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('registrationNumber', { required: true })}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.registrationNumber && <span className="text-red-500 text-sm">Required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Company Type</TranslatedText>
                </label>
                <select
                  {...register('companyType', { required: true })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select</option>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Restaurant Chain">Restaurant Chain</option>
                  <option value="Retail">Retail</option>
                  <option value="Export">Export</option>
                </select>
                {errors.companyType && <span className="text-red-500 text-sm">Required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>GST Number</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('gstNumber', { required: true })}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.gstNumber && <span className="text-red-500 text-sm">Required</span>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Street Address</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('street')}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>City</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('city')}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>State</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('state')}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Pincode</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('pincode')}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
          
          {/* Contact Person */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              <TranslatedText>Contact Person</TranslatedText>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Name</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('contactName', { required: true })}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.contactName && <span className="text-red-500 text-sm">Required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Designation</TranslatedText>
                </label>
                <input
                  type="text"
                  {...register('designation')}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Email</TranslatedText>
                </label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.email && <span className="text-red-500 text-sm">Required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Phone</TranslatedText>
                </label>
                <input
                  type="tel"
                  {...register('phone', { required: true })}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.phone && <span className="text-red-500 text-sm">Required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Password</TranslatedText>
                </label>
                <input
                  type="password"
                  {...register('password', { required: true, minLength: 6 })}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.password && <span className="text-red-500 text-sm">Min 6 characters</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Confirm Password</TranslatedText>
                </label>
                <input
                  type="password"
                  {...register('confirmPassword', { 
                    required: true,
                    validate: value => value === password || "Passwords don't match"
                  })}
                  className="w-full border rounded-md px-3 py-2"
                />
                {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
              </div>
            </div>
          </div>
          
          {/* Processing Capacity */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              <TranslatedText>Processing Capacity</TranslatedText>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Daily Capacity (kg/day)</TranslatedText>
                </label>
                <input
                  type="number"
                  {...register('dailyCapacity')}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Storage Capacity (tons)</TranslatedText>
                </label>
                <input
                  type="number"
                  {...register('storageCapacity')}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-secondary text-white py-3 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            >
              <TranslatedText>{loading ? 'Registering...' : 'Register Company'}</TranslatedText>
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/company/login" className="text-secondary hover:underline">
            <TranslatedText>Already have an account? Login</TranslatedText>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
