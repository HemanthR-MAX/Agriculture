import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import TranslatedText from '../../components/TranslatedText';

const FarmerLogin = () => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState('phone'); // 'phone', 'enterPin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/farmer/send-otp', { phone });
      
      if (response.data.exists) {
        setStep('enterPin');
      } else {
        setError('Account not found. Please register first.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePinLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/farmer/verify-otp', {
        phone,
        pin
      });
      
      login({ ...response.data.farmer, role: 'farmer' }, response.data.token);
      
      // If they somehow have an account but haven't completed details
      if (response.data.farmer.isNewUser) {
        navigate('/farmer/register');
      } else {
        navigate('/farmer');
      }
    } catch (error) {
      alert('Invalid PIN: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Sprout className="w-16 h-16 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2">
          <TranslatedText>Farmer Login</TranslatedText>
        </h1>
        
        {/* Step 1: Phone Number */}
        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Phone Number</TranslatedText>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your 10-digit phone number"
                className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-primary"
                required
                pattern="[0-9]{10}"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                <TranslatedText>{error}</TranslatedText>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50"
            >
              <TranslatedText>{loading ? 'Checking...' : 'Continue'}</TranslatedText>
            </button>
          </form>
        )}
        
        {/* Step 2: Enter PIN */}
        {step === 'enterPin' && (
          <form onSubmit={handlePinLogin} className="space-y-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="text-sm text-blue-800 text-center">
                <TranslatedText>Enter your 6-digit PIN to login</TranslatedText>
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Enter PIN</TranslatedText>
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 6-digit PIN"
                className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-primary"
                required
                pattern="[0-9]{6}"
                maxLength="6"
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50"
            >
              <TranslatedText>{loading ? 'Logging in...' : 'Login'}</TranslatedText>
            </button>
            
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setPin('');
                setError('');
              }}
              className="w-full text-primary hover:underline"
            >
              <TranslatedText>Change Phone Number</TranslatedText>
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center border-t pt-4">
          <p className="text-gray-600 text-sm">
            <TranslatedText>Don't have an account?</TranslatedText>{' '}
            <Link to="/farmer/register" className="text-primary hover:underline font-bold">
              <TranslatedText>Register Here</TranslatedText>
            </Link>
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <Link to="/" className="text-gray-600 hover:underline text-sm">
            <TranslatedText>Back to Home</TranslatedText>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FarmerLogin;
