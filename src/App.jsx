import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));

// Patient Pages
const Dashboard = React.lazy(() => import('./pages/patient/Dashboard'));
const Appointments = React.lazy(() => import('./pages/patient/Appointments'));
const Prescriptions = React.lazy(() => import('./pages/patient/Prescriptions'));
const MedicalHistory = React.lazy(() => import('./pages/patient/MedicalHistory'));
const Bills = React.lazy(() => import('./pages/patient/Bills'));
const Profile = React.lazy(() => import('./pages/patient/Profile'));
const BookAppointment = React.lazy(() => import('./pages/patient/BookAppointment'));
const AISymptomChecker = React.lazy(() => import('./pages/patient/AISymptomChecker'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const BedManagement = React.lazy(() => import('./pages/admin/BedManagement'));
const Inventory = React.lazy(() => import('./pages/admin/Inventory'));

// Doctor Pages
const DoctorDashboard = React.lazy(() => import('./pages/doctor/DoctorDashboard'));
const WritePrescription = React.lazy(() => import('./pages/doctor/WritePrescription'));

// Components
import Sidebar from './components/shared/Sidebar';
import Navbar from './components/shared/Navbar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface relative font-body selection:bg-primary/10 selection:text-primary">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col w-full h-full min-w-0 relative">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent relative custom-scrollbar">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>

        {/* Global Ambient Glow */}
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="fixed top-0 left-0 w-[300px] h-[300px] bg-secondary-container/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      </div>
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Patient Routes */}
          <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="medical-history" element={<MedicalHistory />} />
            <Route path="bills" element={<Bills />} />
            <Route path="profile" element={<Profile />} />
            <Route path="book-appointment" element={<BookAppointment />} />
            <Route path="ai-symptom-checker" element={<AISymptomChecker />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="bed-management" element={<BedManagement />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Doctor Routes */}
          <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorDashboard />} /> {/* Fallback since missing */}
            <Route path="write-prescription" element={<WritePrescription />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
