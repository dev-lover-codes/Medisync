import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Patient Pages
import Dashboard from './pages/patient/Dashboard';
import Appointments from './pages/patient/Appointments';
import Prescriptions from './pages/patient/Prescriptions';
import MedicalHistory from './pages/patient/MedicalHistory';
import Bills from './pages/patient/Bills';
import Profile from './pages/patient/Profile';
import BookAppointment from './pages/patient/BookAppointment';
import AISymptomChecker from './pages/patient/AISymptomChecker';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BedManagement from './pages/admin/BedManagement';
import Inventory from './pages/admin/Inventory';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import WritePrescription from './pages/doctor/WritePrescription';

// Components
import Sidebar from './components/shared/Sidebar';
import Navbar from './components/shared/Navbar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col w-full h-full min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface-container-low p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
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
          </Route>

          {/* Doctor Routes */}
          <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="write-prescription" element={<WritePrescription />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
