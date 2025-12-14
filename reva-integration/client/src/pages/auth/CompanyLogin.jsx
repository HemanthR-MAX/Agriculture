// client/src/pages/auth/CompanyLogin.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import TranslatedText from '../../components/TranslatedText';

const CompanyLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/company/login', {
        email,
        password
      });
      
      login({ ...response.data.company, role: 'company' }, response.data.token);
      navigate('/company');
    } catch (error) {
      alert('Login failed: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Package className="w-16 h-16 text-secondary" />
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2">
          <TranslatedText>Company Login</TranslatedText>
        </h1>
        <p className="text-gray-600 text-center mb-6">
          <TranslatedText>Access your business account</TranslatedText>
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TranslatedText>Email</TranslatedText>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="company@example.com"
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TranslatedText>Password</TranslatedText>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
          >
            <TranslatedText>{loading ? 'Logging in...' : 'Login'}</TranslatedText>
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/company/register" className="text-secondary hover:underline">
            <TranslatedText>Don't have an account? Register</TranslatedText>
          </Link>
        </div>
        
        <div className="mt-4 text-center">
          <Link to="/farmer/login" className="text-primary hover:underline">
            <TranslatedText>Login as Farmer</TranslatedText>
          </Link>
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

export default CompanyLogin;
