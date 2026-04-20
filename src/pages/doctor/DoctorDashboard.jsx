import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';
import logger from '../../utils/logger';

/**
 * DoctorDashboard Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function DoctorDashboard() {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingReviews: 0,
    totalPatients: 0,
    completedToday: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDoctorData();
    }
  }, [user]);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      
      const today = new Date().toISOString().split('T')[0];

      // 1. Fetch Today's Appointments
      const { data: appointments, error: apptError } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles:patient_id (full_name, blood_group, gender)
        `)
        .eq('doctor_id', user.id)
        .gte('appointment_date', today + 'T00:00:00')
        .lte('appointment_date', today + 'T23:59:59')
        .order('appointment_date', { ascending: true });

      if (apptError) throw apptError;
      setUpcomingAppointments(appointments || []);

      // 2. Fetch Stats
      const { count: completedToday } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user.id)
        .eq('status', 'completed')
        .gte('appointment_date', today + 'T00:00:00');

      await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user.id)
        .eq('status', 'confirmed');

      setStats({
        todayAppointments: appointments?.length || 0,
        pendingReviews: 0, // Placeholder for actual review logic
        totalPatients: 0, // Placeholder
        completedToday: completedToday || 0
      });

    } catch (err) {
      logger.error('Error fetching doctor data:', err);
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
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-headline">Welcome, Dr. {userProfile?.full_name?.split(' ')[0]}</h1>
          <p className="text-on-surface-variant font-medium">Have a great day at work today!</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
            <span className="font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/20">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined text-2xl">event_upcoming</span>
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Today's Total</p>
          <p className="text-3xl font-extrabold font-headline mt-1">{stats.todayAppointments}</p>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">Appointments</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/20">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 mb-4">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Completed</p>
          <p className="text-3xl font-extrabold font-headline mt-1">{stats.completedToday}</p>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">Patients treated today</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/20">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 mb-4">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Pending</p>
          <p className="text-3xl font-extrabold font-headline mt-1">{upcomingAppointments.filter(a => a.status === 'pending').length}</p>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">Awaiting confirmation</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/20">
          <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined text-2xl">group</span>
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Total Patients</p>
          <p className="text-3xl font-extrabold font-headline mt-1">128</p> 
          <p className="text-xs text-on-surface-variant mt-2 font-medium">In your registry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold font-headline">Today's Schedule</h2>
            <Link to="/doctor/appointments" className="text-primary font-bold text-sm hover:underline">View All</Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant/30">
                  <tr>
                    <th className="px-6 py-4 font-headline font-bold text-on-surface-variant">Patient Name</th>
                    <th className="px-6 py-4 font-headline font-bold text-on-surface-variant">Time</th>
                    <th className="px-6 py-4 font-headline font-bold text-on-surface-variant">Status</th>
                    <th className="px-6 py-4 font-headline font-bold text-on-surface-variant">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center font-bold text-primary">
                              {appointment.profiles?.full_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold">{appointment.profiles?.full_name}</p>
                              <p className="text-xs text-on-surface-variant">{appointment.profiles?.gender}, {appointment.profiles?.blood_group}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            appointment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {appointment.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link 
                            to={`/doctor/write-prescription?patient=${appointment.patient_id}&appointment=${appointment.id}`}
                            className="text-primary hover:bg-primary/10 p-2 rounded-full inline-flex transition-colors"
                            title="Consult & Prescribe"
                          >
                            <span className="material-symbols-outlined">edit_note</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-on-surface-variant font-medium">
                        No appointments scheduled for today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions & Notes */}
        <div className="space-y-6">
          <div className="bg-primary text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-extrabold font-headline mb-2">Need Help?</h3>
              <p className="text-white/80 text-sm mb-4">Access our knowledge base or contact admin for support.</p>
              <button className="bg-white text-primary px-4 py-2 rounded-full font-bold text-sm shadow-md hover:bg-white/90 transition-all">
                Contact Admin
              </button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-white/10 text-9xl">support_agent</span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/20">
            <h3 className="font-headline font-extrabold text-lg mb-4">Patient Queue</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-xs ring-2 ring-primary/20">{n}</span>
                    <span className="font-bold text-sm">Patient #00{n}</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant">Waiting</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
