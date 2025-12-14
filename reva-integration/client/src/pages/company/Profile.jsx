// client/src/pages/company/Profile.jsx
import { useEffect, useState } from 'react';
import { Building, Mail, Phone, MapPin } from 'lucide-react';
import api from '../../utils/api';
import TranslatedText from '../../components/TranslatedText';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      setCompany(response.data.user);
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

  if (!company) {
    return <div className="text-center py-12">
      <TranslatedText>Profile not found</TranslatedText>
    </div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        <TranslatedText>Company Profile</TranslatedText>
      </h1>

      {/* Company Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building className="w-6 h-6 text-secondary" />
          <h2 className="text-xl font-semibold">
            <TranslatedText>Company Information</TranslatedText>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Company Name</TranslatedText>
            </label>
            <p className="font-medium">{company.companyInfo?.companyName || 'N/A'}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Registration Number</TranslatedText>
            </label>
            <p className="font-medium">{company.companyInfo?.registrationNumber || 'N/A'}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>GST Number</TranslatedText>
            </label>
            <p className="font-medium">{company.companyInfo?.gstNumber || 'N/A'}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Business Type</TranslatedText>
            </label>
            <p className="font-medium">{company.companyInfo?.businessType || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Contact Person */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <Phone className="w-6 h-6 text-secondary" />
          <h2 className="text-xl font-semibold">
            <TranslatedText>Contact Person</TranslatedText>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Name</TranslatedText>
            </label>
            <p className="font-medium">{company.contactPerson?.name || 'N/A'}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              <TranslatedText>Designation</TranslatedText>
            </label>
            <p className="font-medium">{company.contactPerson?.designation || 'N/A'}</p>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-secondary" />
            <div>
              <label className="text-sm text-gray-600">
                <TranslatedText>Email</TranslatedText>
              </label>
              <p className="font-medium">{company.contactPerson?.email || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-secondary" />
            <div>
              <label className="text-sm text-gray-600">
                <TranslatedText>Phone</TranslatedText>
              </label>
              <p className="font-medium">{company.contactPerson?.phone || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-secondary" />
          <h2 className="text-xl font-semibold">
            <TranslatedText>Address</TranslatedText>
          </h2>
        </div>

        {company.companyInfo?.address && (
          <div className="space-y-2">
            <p className="font-medium">{company.companyInfo.address.street}</p>
            <p className="text-gray-600">
              {company.companyInfo.address.city}, {company.companyInfo.address.state} - {company.companyInfo.address.pincode}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
