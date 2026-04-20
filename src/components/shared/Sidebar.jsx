import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Sidebar internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { userProfile, role, signOut } = useAuth();
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
      { to: '/doctor/profile', icon: 'settings', label: 'Profile' },
    ],
    admin: [
      { to: '/admin/dashboard', icon: 'admin_panel_settings', label: 'Admin Center' },
      { to: '/admin/bed-management', icon: 'bed', label: 'Beds' },
      { to: '/admin/inventory', icon: 'inventory', label: 'Inventory' },
      { to: '/admin/profile', icon: 'settings', label: 'Settings' },
    ]
  };

  const currentMenu = menuItems[role] || menuItems.patient;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 flex flex-col p-8 bg-surface border-r border-outline-variant/10 z-[70] transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Brand Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
             </div>
             <div>
                <span className="text-2xl font-black font-headline text-on-surface tracking-tighter leading-none block">MediSync</span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">Clinical Network v2.0</span>
             </div>
          </div>
        </div>

        {/* User Module */}
        <div className="mb-10 p-6 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/5 flex flex-col items-center group relative overflow-hidden transition-all hover:bg-white hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1">
          <div className="relative w-24 h-24 mb-4">
            <div className="w-full h-full rounded-[2rem] overflow-hidden border-4 border-surface shadow-inner group-hover:scale-105 transition-transform duration-500">
               <img 
                 className="w-full h-full object-cover" 
                 src={userProfile?.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAwfI3BpPZZmY1N3tcehtrjKSKIf1Xkkkpi9jZJyB-W3q6gR2bPOw-CMgIA1uz24qxl3V-5zoz2z_T-WCp90dSrqHm9DheCqZDTkItCwPUnzbFexOXFJ16XllIY2zXsrZnGSaxHn2JQ5fQPoTIrEmC32PcXnfTsBby7Lw9YcRIw-xeNafycMF21Hf_22S5Rj-k8XQlFUEIlEzPFTy9SfYiOkH2ffa0f88nUFanmaIKQC9tPsqfvulYeUHoIOFhEYLVEQ5abLwD6cQw"} 
                 alt="Profile" 
               />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-surface rounded-full shadow-lg"></div>
          </div>
          <h3 className="font-headline font-black text-on-surface tracking-tight text-lg line-clamp-1 group-hover:text-primary transition-colors">{userProfile?.full_name || 'Subject Unidentified'}</h3>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full mt-3">
             {role || 'PATIENT'} GRADE A
          </span>
        </div>

        {/* Navigation Core */}
        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar py-2">
          {currentMenu.map((item) => (
            <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} onClick={onClose} />
          ))}
        </nav>

        {/* Tactical Actions */}
        <div className="mt-8 pt-8 border-t border-outline-variant/10 space-y-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-6 py-4 text-rose-600 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
          >
            Terminal Output
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
          
          <div className="p-6 bg-primary rounded-[2.5rem] text-center shadow-2xl shadow-primary/40 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <span className="material-symbols-outlined text-6xl text-white">support_agent</span>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-3 relative z-10">Critical Protocol</p>
             <button className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 hover:bg-white/20 text-white w-full py-3.5 rounded-2xl transition-all relative z-10 border border-white/10">
                Emergency Dispatch
             </button>
          </div>
        </div>
      </aside>
    </>
  );
};

/**
 * NavItem internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const NavItem = ({ to, icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-4 px-6 py-4 font-black transition-all rounded-2xl relative group ${
          isActive
            ? 'text-primary bg-primary/5 shadow-sm'
            : 'text-on-surface-variant/40 hover:text-primary hover:bg-surface-container-low'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`material-symbols-outlined text-2xl transition-all ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span> 
          <span className="text-[11px] uppercase tracking-[0.2em]">{label}</span>
          {isActive && (
            <div className="absolute left-0 w-1.5 h-6 bg-primary rounded-full -ml-[3px]"></div>
          )}
        </>
      )}
    </NavLink>
  );
};

export default Sidebar;


