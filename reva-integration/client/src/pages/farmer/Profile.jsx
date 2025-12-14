// client/src/pages/farmer/Profile.jsx
import { useEffect, useState } from 'react';
import { User, MapPin, Droplets, Mountain } from 'lucide-react';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';

const FarmerProfile = () => {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      setFarmer(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">
      <TranslatedText>Loading...</TranslatedText>
    </div>;
  }

  if (!farmer) {
    return <div className="text-center py-12">
      <TranslatedText>Profile not found</TranslatedText>
    </div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        <TranslatedText>My Profile</TranslatedText>
      </h1>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">
            <TranslatedText>Personal Information</TranslatedText>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Full Name</TranslatedText>
            </label>
            <p className="font-medium">{farmer.personalInfo?.name || 'N/A'}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Phone Number</TranslatedText>
            </label>
            <p className="font-medium">{farmer.personalInfo?.phone || 'N/A'}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Email</TranslatedText>
            </label>
            <p className="font-medium">{farmer.email || 'N/A'}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Aadhaar Number</TranslatedText>
            </label>
            <p className="font-medium">{farmer.personalInfo?.aadhaar || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">
            <TranslatedText>Location</TranslatedText>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Village</TranslatedText>
            </label>
            <p className="font-medium">{farmer.personalInfo?.village || 'N/A'}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>District</TranslatedText>
            </label>
            <p className="font-medium">{farmer.personalInfo?.district || 'N/A'}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>State</TranslatedText>
            </label>
            <p className="font-medium">{farmer.personalInfo?.state || 'N/A'}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Pincode</TranslatedText>
            </label>
            <p className="font-medium">{farmer.personalInfo?.pincode || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Farm Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mountain className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">
            <TranslatedText>Farm Information</TranslatedText>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Total Land</TranslatedText>
            </label>
            <p className="font-medium">{farmer.farmInfo?.totalLand || 'N/A'} acres</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Cultivable Land</TranslatedText>
            </label>
            <p className="font-medium">{farmer.farmInfo?.cultivableLand || 'N/A'} acres</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Soil Type</TranslatedText>
            </label>
            <p className="font-medium">{farmer.farmInfo?.soilType || 'N/A'}</p>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <div>
              <label className="text-sm text-gray-600">
                <TranslatedText>Irrigation Type</TranslatedText>
              </label>
              <p className="font-medium">{farmer.farmInfo?.irrigationType || 'N/A'}</p>
            </div>
          </div>
        </div>

        {farmer.farmInfo?.gpsLocation && (
          <div className="mt-4">
            <label className="text-sm text-gray-600">
              <TranslatedText>GPS Location</TranslatedText>
            </label>
            <p className="font-medium">
              {farmer.farmInfo.gpsLocation.lat}, {farmer.farmInfo.gpsLocation.lng}
            </p>
          </div>
        )}
      </div>

      {/* Bank Details */}
      {farmer.bankDetails && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText>Bank Details</TranslatedText>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">
                <TranslatedText>Bank Name</TranslatedText>
              </label>
              <p className="font-medium">{farmer.bankDetails.bankName || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">
                <TranslatedText>Account Number</TranslatedText>
              </label>
              <p className="font-medium">{farmer.bankDetails.accountNumber || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">
                <TranslatedText>IFSC Code</TranslatedText>
              </label>
              <p className="font-medium">{farmer.bankDetails.ifscCode || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">
                <TranslatedText>Account Holder Name</TranslatedText>
              </label>
              <p className="font-medium">{farmer.bankDetails.accountHolderName || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProfile;
