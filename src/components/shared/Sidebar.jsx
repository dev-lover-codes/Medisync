import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, userProfile, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = {
    patient: [
      { to: '/patient/dashboard', icon: 'dashboard', label: 'Dashboard' },
      { to: '/patient/appointments', icon: 'calendar_month', label: 'Appointments' },
      { to: '/patient/medical-history', icon: 'history', label: 'History' },
      { to: '/patient/prescriptions', icon: 'prescriptions', label: 'Prescriptions' },
      { to: '/patient/bills', icon: 'payments', label: 'Bills' },
      { to: '/patient/ai-symptom-checker', icon: 'psychiatry', label: 'AI Checker' },
      { to: '/patient/profile', icon: 'settings', label: 'Settings' },
    ],
    doctor: [
      { to: '/doctor/dashboard', icon: 'dashboard', label: 'Doctor Dashboard' },
      { to: '/doctor/appointments', icon: 'calendar_today', label: 'Appointments' },
      { to: '/doctor/write-prescription', icon: 'edit_note', label: 'Write Prescription' },
      { to: '/patient/profile', icon: 'settings', label: 'Profile' },
    ],
    admin: [
      { to: '/admin/dashboard', icon: 'admin_panel_settings', label: 'Admin Center' },
      { to: '/admin/bed-management', icon: 'bed', label: 'Beds' },
      { to: '/admin/inventory', icon: 'inventory', label: 'Inventory' },
      { to: '/patient/profile', icon: 'settings', label: 'Settings' },
    ]
  };

  const currentMenu = menuItems[role] || menuItems.patient;

  return (
    <aside className="w-64 h-full flex flex-col p-6 bg-white border-r border-outline-variant/20 z-50 overflow-y-auto">
      <div className="mb-8 p-2 flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
        <span className="text-2xl font-extrabold font-headline tracking-tighter">MediSync</span>
      </div>

      <div className="flex flex-col items-center mb-8 p-5 bg-surface-container-low rounded-2xl border border-outline-variant/10">
        <div className="relative w-20 h-20 mb-3 shadow-md rounded-full bg-white p-1">
          <div className="w-full h-full rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-2xl overflow-hidden">
            {userProfile?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <h3 className="font-headline font-bold text-on-surface text-center line-clamp-1">{userProfile?.full_name || 'User Name'}</h3>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full mt-2">
          {role || 'User'}
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {currentMenu.map((item) => (
          <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200"
        >
          <span className="material-symbols-outlined text-sm">logout</span> Logout
        </button>

        <div className="p-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl text-center shadow-lg shadow-primary/20 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold opacity-80 mb-1 uppercase tracking-widest">Emergency</p>
            <button className="text-xs font-bold bg-white/20 hover:bg-white/30 w-full py-2 rounded-lg transition-all backdrop-blur-sm">Contact Support</button>
          </div>
          <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-white/10 text-6xl group-hover:scale-110 transition-transform">support_agent</span>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 font-bold transition-all rounded-xl ${
          isActive
            ? 'text-primary bg-primary/10 shadow-sm'
            : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
        }`
      }
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span> 
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};

export default Sidebar;

