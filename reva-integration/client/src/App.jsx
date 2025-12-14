// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FarmerLogin from './pages/auth/FarmerLogin';
import FarmerRegister from './pages/auth/FarmerRegister';
import CompanyLogin from './pages/auth/CompanyLogin';
import CompanyRegister from './pages/auth/CompanyRegister';
import FarmerLayout from './layouts/FarmerLayout';
import CompanyLayout from './layouts/CompanyLayout';
import FarmerDashboard from './pages/farmer/Dashboard';
import CropsList from './pages/farmer/CropsList';
import AddCrop from './pages/farmer/AddCrop';
import CropDetails from './pages/farmer/CropDetails';
import FarmerContracts from './pages/farmer/Contracts';
import FarmerProfile from './pages/farmer/Profile';
import CompanyDashboard from './pages/company/Dashboard';
import RequirementsList from './pages/company/Requirements';
import AddRequirement from './pages/company/AddRequirement';
import CompanyContracts from './pages/company/Contracts';
import CompanyProfile from './pages/company/Profile';

import { useAuthStore } from './store/authStore';
import { isTokenExpired } from './utils/auth';
// Protected Route Component
// App.jsx

const ProtectedRoute = ({ children, allowedTypes }) => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token || isTokenExpired(token)) {
    useAuthStore.getState().logout();
    return <Navigate to="/" replace />;
  }

  if (allowedTypes && (!user || !allowedTypes.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return children;
};



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/farmer/login" element={<FarmerLogin />} />
        <Route path="/farmer/register" element={<FarmerRegister />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />

        {/* Farmer Protected Routes */}
        <Route
          path="/farmer"
          element={
            <ProtectedRoute allowedTypes={['farmer']}>
              <FarmerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<FarmerDashboard />} />
          <Route path="crops" element={<CropsList />} />
          <Route path="crops/add" element={<AddCrop />} />
          <Route path="crops/:id" element={<CropDetails />} />
          <Route path="contracts" element={<FarmerContracts />} />
          <Route path="profile" element={<FarmerProfile />} />
        </Route>

        {/* Company Protected Routes */}
        <Route
          path="/company"
          element={
            <ProtectedRoute allowedTypes={['company']}>
              <CompanyLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="requirements" element={<RequirementsList />} />
          <Route path="requirements/new" element={<AddRequirement />} />
          <Route path="contracts" element={<CompanyContracts />} />
          <Route path="profile" element={<CompanyProfile />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
