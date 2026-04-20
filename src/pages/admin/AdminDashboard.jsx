import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';
import logger from '../../utils/logger';

/**
 * AdminDashboard Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    activeBeds: 24,
    pendingPayments: 0,
    pharmacyAlerts: 3
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  
     
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Role Counts
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('role');
      
      if (profileError) throw profileError;
      
      const patientsCount = profiles.filter(p => p.role === 'patient').length;
      const doctorsCount = profiles.filter(p => p.role === 'doctor').length;

      // 2. Fetch Pending Payments
      const { data: bills, error: billError } = await supabase
        .from('bills')
        .select('amount')
        .eq('status', 'unpaid');
      
      if (billError) throw billError;
      const totalPending = bills.reduce((acc, b) => acc + b.amount, 0);

      // 3. Fetch Recent Patients (Latest signups)
      const { data: latest } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient')
        .order('id', { ascending: false }) // Fallback since no created_at
        .limit(5);

      setStats({
        totalPatients: patientsCount,
        totalDoctors: doctorsCount,
        activeBeds: 24, // Placeholder for bed management
        pendingPayments: totalPending,
        pharmacyAlerts: 3
      });
      setRecentPatients(latest || []);

    } catch (err) {
      logger.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold font-headline tracking-tight">Hospital Command Center</h1>
          <p className="text-on-surface-variant font-medium">System overview and facility management</p>
        </div>
        <button 
          onClick={fetchAdminStats}
          className="p-2 bg-white rounded-full shadow-sm border border-outline-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-primary">refresh</span>
        </button>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-2xl">group</span>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">+12%</span>
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Total Patients</p>
          <p className="text-3xl font-extrabold font-headline mt-1 tracking-tighter">{stats.totalPatients}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">medical_services</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Active Staff</p>
          <p className="text-3xl font-extrabold font-headline mt-1 tracking-tighter">{stats.totalDoctors}</p>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">Physicians & Specialists</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined text-2xl">bed</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Bed Occupancy</p>
          <p className="text-3xl font-extrabold font-headline mt-1 tracking-tighter">78%</p>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">{stats.activeBeds} beds available</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
              <span className="material-symbols-outlined text-2xl">payments</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Pending Revenue</p>
          <p className="text-3xl font-extrabold font-headline mt-1 tracking-tighter">₹{stats.pendingPayments.toLocaleString()}</p>
          <p className="text-xs text-red-600 mt-2 font-bold tracking-tight inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">warning</span> Action required
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Registrations */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold font-headline">Recent Registrations</h2>
            <button className="text-primary text-sm font-bold">View All</button>
          </div>
          <div className="space-y-4">
            {recentPatients.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold">
                    {p.full_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{p.full_name}</p>
                    <p className="text-xs text-on-surface-variant font-medium">Role: {p.role}</p>
                  </div>
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-on-surface border border-outline-variant/30">
                  New Patient
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health / Pharmacy Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <h2 className="text-xl font-extrabold font-headline mb-6">Facility Health</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                <span>Pharmacy Stock Level</span>
                <span className="text-amber-600">Low Stock (3)</span>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full w-[45%]"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                <span>Server Health (Supabase)</span>
                <span className="text-green-600">Operational</span>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-[100%]"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                <span>Emergency Ward Capacity</span>
                <span className="text-blue-600">Normal</span>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-[60%]"></div>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/10">
              <Link to="/admin/profile" className="w-full py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">settings</span>
                System Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
