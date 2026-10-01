import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import logger from '../../utils/logger';

/**
 * Dashboard internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [pendingBillsTotal, setPendingBillsTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      setLoading(true);

      try {
        // Look up patient record by email (reliable — UUID != numeric patient_id)
        const { data: patientRow } = await supabase
          .from('users')
          .select('user_id, patient_id, linked_id')
          .eq('email', user.email)
          .maybeSingle();

        const numericPatientId = patientRow?.patient_id || patientRow?.linked_id || patientRow?.user_id || null;

        if (numericPatientId) {
          const { data: aptData, error: aptError } = await supabase
            .from('appointments')
            .select(`
              *, 
              doctors(first_name, last_name, specialization, image_url)
            `)
            .eq('patient_id', numericPatientId)
            .eq('status', 'scheduled')
            .order('appointment_date', { ascending: true })
            .limit(3);

          if (!aptError && aptData) {
            setAppointments(aptData);
          } else if (aptError) {
            logger.warn('Dashboard: Appointments fetch error:', aptError.message);
          }

          // Fetch pending bill total
          try {
            const { data: billData, error: billError } = await supabase
              .from('billing')
              .select('total_amount')
              .eq('patient_id', numericPatientId)
              .eq('payment_status', 'pending');

            if (!billError && billData) {
              const total = billData.reduce((sum, bill) => sum + (Number(bill.total_amount) || 0), 0);
              setPendingBillsTotal(total);
            }
          } catch {
            logger.warn('Dashboard: Billing table accessibility issue.');
          }
        }

      } catch (err) {
        logger.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] bg-surface">
        <div className="relative w-20 h-20 mb-6">
           <div className="absolute inset-0 border-[5px] border-primary/10 rounded-full"></div>
           <div className="absolute inset-0 border-[5px] border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-lg font-bold text-on-surface">Loading your dashboard...</h2>
        <p className="text-sm text-on-surface-variant mt-2">Just a moment</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12 min-h-screen animate-fade-in">
      {/* Welcome Banner Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-on-surface p-10 md:p-14 text-white shadow-3xl shadow-black/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Patient Dashboard</p>
              <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter leading-none">
                Hello, <br className="hidden md:block" />
                <span className="text-primary italic">
                  {userProfile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'}
                </span>
              </h1>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-white/40">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
                <span className="material-symbols-outlined text-primary fill-1">verified_user</span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Identity Verified</span>
              </div>
              <Link to="/patient/profile" className="inline-flex items-center gap-4 bg-primary px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-95 transition-all">
                My Profile
              </Link>
            </div>
          </div>
          <div className="relative shrink-0">
            <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="w-48 h-48 md:w-64 md:h-64 bg-surface-container-high rounded-[3rem] overflow-hidden p-2 ring-1 ring-white/10 shadow-inner">
               <img 
                 className="w-full h-full object-cover rounded-[2.5rem] drop-shadow-2xl" 
                  alt="Profile" 
                  src={userProfile?.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.full_name || user?.email || 'U')}&background=6f5673&color=fff&size=256`}
                />
             </div>
          </div>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Appointments', val: appointments.length, sub: 'Upcoming scheduled visits', icon: 'event_upcoming', color: 'primary' },
          { label: 'Prescriptions', val: '—', sub: 'Active medications', icon: 'medication', color: 'blue-500' },
          { label: 'Pending Bills', val: pendingBillsTotal > 0 ? `₹${pendingBillsTotal}` : '₹0', sub: 'Outstanding balance', icon: 'account_balance_wallet', color: 'orange-500' },
          { label: 'Wellness', val: '—', sub: 'Connect your vitals device', icon: 'favorite', color: 'green-500' }
        ].map((kpi, idx) => {
          const colorMap = {
            'primary': 'bg-primary/10 text-primary',
            'blue-500': 'bg-blue-500/10 text-blue-500',
            'orange-500': 'bg-orange-500/10 text-orange-500',
            'green-500': 'bg-green-500/10 text-green-500'
          };
          const textColorMap = {
            'primary': 'text-primary',
            'blue-500': 'text-blue-500',
            'orange-500': 'text-orange-500',
            'green-500': 'text-green-500'
          };
          
          return (
            <div key={idx} className="group bg-white p-8 rounded-[2.5rem] shadow-xl shadow-black/[0.02] hover:shadow-2xl hover:shadow-primary/5 transition-all border border-outline-variant/10">
              <div className={`w-12 h-12 rounded-2xl ${colorMap[kpi.color] || 'bg-primary/10'} flex items-center justify-center mb-6`}>
                <span className={`material-symbols-outlined ${textColorMap[kpi.color] || 'text-primary'} font-black`}>{kpi.icon}</span>
              </div>
              <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
              <h2 className="text-3xl font-black text-on-surface tracking-tighter mb-2">{kpi.val}</h2>
              <p className="text-[9px] font-black text-on-surface-variant/60 uppercase tracking-widest">{kpi.sub}</p>
            </div>
          );
        })}
      </section>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Appointments */}
        <div className="lg:col-span-2 space-y-12">
          {/* Appointments */}
          <section className="space-y-8">
            <div className="flex justify-between items-end border-b border-outline-variant/10 pb-6 px-2">
              <div>
                <h2 className="text-3xl font-black text-on-surface tracking-tighter leading-none">Upcoming Appointments</h2>
                <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mt-2">Your scheduled doctor visits</p>
              </div>
              <Link to="/patient/appointments" className="text-primary text-[10px] font-black hover:underline uppercase tracking-widest px-6 py-3 bg-primary/5 rounded-2xl">View All</Link>
            </div>
            
            <div className="space-y-6">
              {appointments.length === 0 ? (
                <div className="bg-surface-container-lowest py-20 rounded-[3rem] text-center border-2 border-dashed border-outline-variant/20 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-outline-variant">event_busy</span>
                  </div>
                  <p className="text-on-surface-variant font-bold uppercase tracking-[0.2em] text-[11px]">No upcoming appointments</p>
                  <button onClick={() => navigate('/patient/book-appointment')} className="mt-8 px-10 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">Book Appointment</button>
                </div>
              ) : (
                appointments.map((apt) => (
                  <div key={apt.id} className="group bg-white p-6 rounded-[2.5rem] flex items-center gap-6 hover:shadow-2xl hover:shadow-black/5 transition-all border border-outline-variant/10">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-surface bg-surface-container-high shrink-0 transition-transform group-hover:scale-95">
                      <img 
                        className="w-full h-full object-cover" 
                        alt={`Dr. ${apt.doctors?.first_name || ''} ${apt.doctors?.last_name || ''}`}
                        src={apt.doctors?.image_url || `https://ui-avatars.com/api/?name=Dr&background=6f5673&color=fff&size=128`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{apt.doctors?.specialization || 'General'}</p>
                      <h4 className="font-black text-on-surface text-xl tracking-tight leading-none mb-3">
                        Dr. {apt.doctors ? `${apt.doctors.first_name || ''} ${apt.doctors.last_name || ''}` : 'Specialist'}
                      </h4>
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-surface-container-low rounded-lg flex items-center gap-2">
                           <span className="material-symbols-outlined text-[14px] text-on-surface-variant">calendar_month</span>
                           <span className="text-[10px] font-black text-on-surface uppercase tracking-tighter">{new Date(apt.appointment_date).toLocaleDateString('en-GB')}</span>
                        </div>
                        <div className="px-3 py-1 bg-surface-container-low rounded-lg flex items-center gap-2">
                           <span className="material-symbols-outlined text-[14px] text-on-surface-variant">schedule</span>
                           <span className="text-[10px] font-black text-on-surface uppercase tracking-tighter">{apt.appointment_time || apt.time_slot}</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-12 h-12 bg-surface-container-high text-on-surface rounded-2xl hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined">edit_calendar</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Vitals & AI Insight */}
        <div className="space-y-12">
          {/* Recent Vitals */}
          <section className="bg-white p-10 rounded-[3rem] border border-outline-variant/10 shadow-xl shadow-black/[0.02]">
            <h2 className="text-xl font-black text-on-surface uppercase tracking-widest border-b border-outline-variant/10 pb-6 mb-8">My Vitals</h2>
            <div className="space-y-8">
              {[
                { label: 'Blood Pressure', value: '—', icon: 'favorite', color: 'red-500' },
                { label: 'Pulse Rate', value: '—', icon: 'pulse_alert', color: 'blue-500' },
                { label: 'SpO2 Level', value: '—', icon: 'air', color: 'cyan-500' },
                { label: 'Body Mass', value: '—', icon: 'monitor_weight', color: 'purple-500' },
              ].map((vital, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center group-hover:bg-on-surface group-hover:text-white transition-all`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{vital.icon}</span>
                    </div>
                    <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] leading-none">{vital.label}</span>
                  </div>
                  <span className="text-lg font-black text-on-surface-variant tracking-tighter">{vital.value}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-on-surface-variant/50 mt-8 font-medium">Connect a health device to see real-time vitals</p>
          </section>

          {/* AI Companion Insight */}
          <section className="relative overflow-hidden bg-primary p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/20 group">
             <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white text-primary flex items-center justify-center shadow-2xl shadow-black/10 transition-transform group-hover:rotate-12">
                   <span className="material-symbols-outlined text-3xl font-black">smart_toy</span>
                </div>
                <h3 className="text-lg font-black uppercase tracking-[0.2em]">AI Symptom Checker</h3>
                <p className="text-[11px] font-bold text-white/60 leading-relaxed border-t border-white/10 pt-6">
                  Describe your symptoms and get instant AI-powered health insights and guidance.
                </p>
                <button onClick={() => navigate('/patient/ai-symptom-checker')} className="w-full py-4 bg-white text-primary font-black rounded-2xl uppercase text-[10px] tracking-widest hover:scale-95 transition-all">Check Symptoms</button>
             </div>
             
             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transition-transform duration-[4s] group-hover:scale-150">
                <span className="material-symbols-outlined text-8xl font-light">psychology</span>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
