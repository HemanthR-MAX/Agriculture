// client/src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { Sprout, Package, TrendingUp, Users, Shield, Clock } from 'lucide-react';
import TranslatedText from '../components/TranslatedText';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Sprout className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">AgriLink</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/farmer/login" className="text-primary hover:underline font-medium">
                <TranslatedText>Farmer Login</TranslatedText>
              </Link>
              <Link to="/company/login" className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                <TranslatedText>Company Login</TranslatedText>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <TranslatedText>Smart Harvest Optimization Platform</TranslatedText>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            <TranslatedText>Connect farmers with food processing companies for guaranteed sales, better prices, and reduced waste</TranslatedText>
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/farmer/login" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-green-600 transition text-lg font-medium">
              <TranslatedText>Join as Farmer</TranslatedText>
            </Link>
            <Link to="/company/register" className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition text-lg font-medium">
              <TranslatedText>Join as Company</TranslatedText>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            <TranslatedText>Why Choose AgriLink?</TranslatedText>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                <TranslatedText>100%+ Higher Income</TranslatedText>
              </h3>
              <p className="text-gray-600">
                <TranslatedText>Farmers earn double through direct contracts and guaranteed buyers</TranslatedText>
              </p>
            </div>
            
            <div className="text-center p-6">
              <Shield className="w-16 h-16 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                <TranslatedText>Guaranteed Sales</TranslatedText>
              </h3>
              <p className="text-gray-600">
                <TranslatedText>Pre-harvest contracts ensure farmers have confirmed buyers before planting</TranslatedText>
              </p>
            </div>
            
            <div className="text-center p-6">
              <Clock className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                <TranslatedText>AI-Powered Matching</TranslatedText>
              </h3>
              <p className="text-gray-600">
                <TranslatedText>Smart algorithms match farmers with companies based on quality, timing, and location</TranslatedText>
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* For Farmers */}
      <section className="bg-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Sprout className="w-16 h-16 text-primary mb-6" />
              <h2 className="text-3xl font-bold mb-6">
                <TranslatedText>For Farmers</TranslatedText>
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-primary text-2xl">✓</span>
                  <div>
                    <strong><TranslatedText>Guaranteed Buyers</TranslatedText></strong>
                    <p className="text-gray-600"><TranslatedText>Know who will buy before you harvest</TranslatedText></p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-2xl">✓</span>
                  <div>
                    <strong><TranslatedText>Better Prices</TranslatedText></strong>
                    <p className="text-gray-600"><TranslatedText>Earn ₹18/kg vs ₹8/kg in traditional markets</TranslatedText></p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-2xl">✓</span>
                  <div>
                    <strong><TranslatedText>Smart Recommendations</TranslatedText></strong>
                    <p className="text-gray-600"><TranslatedText>AI tells you what quality to target for maximum profit</TranslatedText></p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-2xl">✓</span>
                  <div>
                    <strong><TranslatedText>Fast Payments</TranslatedText></strong>
                    <p className="text-gray-600"><TranslatedText>20% advance, 80% within 2 hours of delivery</TranslatedText></p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-4">
                <TranslatedText>Join 500+ Farmers</TranslatedText>
              </h3>
              <Link to="/farmer/login" className="block w-full bg-primary text-white text-center py-3 rounded-lg hover:bg-green-600 transition font-medium">
                <TranslatedText>Get Started - It's Free</TranslatedText>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* For Companies */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-4">
                <TranslatedText>Join 10+ Companies</TranslatedText>
              </h3>
              <Link to="/company/register" className="block w-full bg-secondary text-white text-center py-3 rounded-lg hover:bg-blue-600 transition font-medium">
                <TranslatedText>Start Sourcing Better</TranslatedText>
              </Link>
            </div>
            
            <div>
              <Package className="w-16 h-16 text-secondary mb-6" />
              <h2 className="text-3xl font-bold mb-6">
                <TranslatedText>For Companies</TranslatedText>
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-secondary text-2xl">✓</span>
                  <div>
                    <strong><TranslatedText>Consistent Supply</TranslatedText></strong>
                    <p className="text-gray-600"><TranslatedText>95%+ fulfillment rate, no more shortages</TranslatedText></p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary text-2xl">✓</span>
                  <div>
                    <strong><TranslatedText>20% Cost Savings</TranslatedText></strong>
                    <p className="text-gray-600"><TranslatedText>Buy at ₹18/kg vs ₹22/kg spot market prices</TranslatedText></p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary text-2xl">✓</span>
                  <div>
                    <strong><TranslatedText>Quality Matching</TranslatedText></strong>
                    <p className="text-gray-600"><TranslatedText>Get exactly the grade you need, not overpay for Grade A</TranslatedText></p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary text-2xl">✓</span>
                  <div>
                    <strong><TranslatedText>Automated Scheduling</TranslatedText></strong>
                    <p className="text-gray-600"><TranslatedText>AI manages daily deliveries from multiple farmers</TranslatedText></p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4">
            <TranslatedText>© 2025 AgriLink. Connecting farmers with buyers for a better tomorrow.</TranslatedText>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
