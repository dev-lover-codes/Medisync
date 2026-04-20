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
        // Fetch Upcoming Appointments
        // We handle the possibility of UUID/INT mismatch by fetching by email or 
        // using the linked patient record from userProfile if available.
        const patientSearchId = userProfile?.patient_id || userProfile?.linked_id || user?.id;
        const isNumeric = /^\d+$/.test(patientSearchId);

        const { data: aptData, error: aptError } = await supabase
          .from('appointments')
          .select(`
            *, 
            doctors(first_name, last_name, specialization, image_url)
          `)
          .or(`patient_id.eq.${isNumeric ? patientSearchId : -1}`) // Only query if numeric
          .eq('status', 'upcoming')
          .order('appointment_date', { ascending: true })
          .limit(3);

        if (!aptError && aptData) {
          setAppointments(aptData);
        } else if (aptError) {
          logger.warn("Dashboard: Appointments fetch error (likely no matching patient_id):", aptError.message);
        }

        // Fetch pending bill total
        try {
          const { data: billData, error: billError } = await supabase
            .from('billing') // Changed from 'bills' to 'billing' to match schema.sql
            .select('total_amount')
            .eq('patient_id', isNumeric ? patientSearchId : -1)
            .eq('payment_status', 'pending');

          if (!billError && billData) {
            const total = billData.reduce((sum, bill) => sum + (Number(bill.total_amount) || 0), 0);
            setPendingBillsTotal(total);
          }
        } catch {
          logger.warn("Dashboard: Billing table accessibility issue.");
        }

      } catch (err) {
        logger.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] bg-surface">
        <div className="relative w-24 h-24 mb-8">
           <div className="absolute inset-0 border-[6px] border-primary/10 rounded-full"></div>
           <div className="absolute inset-0 border-[6px] border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-black text-on-surface uppercase tracking-[0.3em] animate-pulse">Syncing Metrics</h2>
        <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mt-4">Clinical Protocol Active</p>
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
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Patient Command Center</p>
              <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter leading-none">
                Salutations, <br className="hidden md:block" />
                <span className="text-primary italic">
                  {userProfile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                </span>
              </h1>
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-white/40">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
                <span className="material-symbols-outlined text-primary fill-1">verified_user</span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Identity Verified</span>
              </div>
              <Link to="/patient/profile" className="inline-flex items-center gap-4 bg-primary px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-95 transition-all">
                Registry Settings
              </Link>
            </div>
          </div>
          <div className="relative shrink-0">
            <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="w-48 h-48 md:w-64 md:h-64 bg-surface-container-high rounded-[3rem] overflow-hidden p-2 ring-1 ring-white/10 shadow-inner">
               <img 
                 className="w-full h-full object-cover rounded-[2.5rem] drop-shadow-2xl" 
                  alt="Profile Ambient" 
                  src={userProfile?.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuD9R_8Kk9U0N0f3Z6_6y5uQ0uD1V_p7QYV_7T1W1Y_v0X8_a"}
                />
             </div>
          </div>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Upcoming Slots', val: appointments.length, sub: 'Active clinician requests', icon: 'event_upcoming', color: 'primary' },
          { label: 'Prescriptions', val: '3', sub: 'Doses due cycles', icon: 'medication', color: 'blue-500' },
          { label: 'Settlements', val: `₹${pendingBillsTotal}`, sub: 'Unresolved balances', icon: 'account_balance_wallet', color: 'orange-500' },
          { label: 'Wellness Level', val: '98%', sub: 'Aggregated vitals', icon: 'favorite', color: 'green-500' }
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
        {/* Left Column: Appointments & Prescriptions */}
        <div className="lg:col-span-2 space-y-12">
          {/* Appointments */}
          <section className="space-y-8">
            <div className="flex justify-between items-end border-b border-outline-variant/10 pb-6 px-2">
              <div>
                <h2 className="text-3xl font-black text-on-surface tracking-tighter leading-none">Clinician Schedule</h2>
                <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mt-2">Upcoming registered encounters</p>
              </div>
              <Link to="/patient/appointments" className="text-primary text-[10px] font-black hover:underline uppercase tracking-widest px-6 py-3 bg-primary/5 rounded-2xl">Expansion Protocol</Link>
            </div>
            
            <div className="space-y-6">
              {appointments.length === 0 ? (
                <div className="bg-surface-container-lowest py-20 rounded-[3rem] text-center border-2 border-dashed border-outline-variant/20 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-outline-variant">event_busy</span>
                  </div>
                  <p className="text-on-surface-variant font-black uppercase tracking-[0.2em] text-[11px]">No active clinical records found in schedule.</p>
                  <button onClick={() => navigate('/patient/book-appointment')} className="mt-8 px-10 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">Initiate Request</button>
                </div>
              ) : (
                appointments.map((apt) => (
                  <div key={apt.id} className="group bg-white p-6 rounded-[2.5rem] flex items-center gap-6 hover:shadow-2xl hover:shadow-black/5 transition-all border border-outline-variant/10">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-surface bg-surface-container-high shrink-0 transition-transform group-hover:scale-95">
                      <img 
                        className="w-full h-full object-cover" 
                        alt={apt.doctors?.full_name}
                        src={apt.doctors?.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuClef_wlPZAhy5lua2Vq5Bmaoj5U3kPFh_d_HPCR7YJESvMwH09GyDhvvVERy1qaDRy2oGwNaL2VOafKQy3viee2XE5Bm7EazgEVC35LGn7gluKrlbiD9ufrOGOhNcYuTJux6jiCNstqd63ktjl4swNP6WthtW1SOBQ0iMgrU_-mCYLM-h3YW6mWC_2V1VutwdVqhfIcOmRfF3nYpeN7l7zpP2ALJ_Q0gHZmbi383D0xxjyXJGAadX1wOrxqr-qdOoaBMXAVP8jvxw"}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{apt.doctors?.specialization || 'Synchronous Ops'}</p>
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
            <h2 className="text-xl font-black text-on-surface uppercase tracking-widest border-b border-outline-variant/10 pb-6 mb-8">Clinical Vitals</h2>
            <div className="space-y-8">
              {[
                { label: 'Blood Pressure', value: '118/72', icon: 'favorite', color: 'red-500' },
                { label: 'Pulse Rate', value: '74 bpm', icon: 'pulse_alert', color: 'blue-500' },
                { label: 'SpO2 Level', value: '99%', icon: 'air', color: 'cyan-500' },
                { label: 'Body Mass', value: '64 kg', icon: 'monitor_weight', color: 'purple-500' },
              ].map((vital, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center group-hover:bg-on-surface group-hover:text-white transition-all`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{vital.icon}</span>
                    </div>
                    <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] leading-none">{vital.label}</span>
                  </div>
                  <span className="text-lg font-black text-on-surface tracking-tighter">{vital.value}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-5 bg-on-surface text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-90 active:scale-95 transition-all">Refresh Metrics</button>
          </section>

          {/* AI Companion Insight */}
          <section className="relative overflow-hidden bg-primary p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/20 group">
             <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white text-primary flex items-center justify-center shadow-2xl shadow-black/10 transition-transform group-hover:rotate-12">
                   <span className="material-symbols-outlined text-3xl font-black">smart_toy</span>
                </div>
                <h3 className="text-lg font-black uppercase tracking-[0.2em]">MediSync AI</h3>
                <p className="text-[11px] font-black text-white/50 leading-relaxed italic border-t border-white/10 pt-6">
                  "Optimization recommended. Your recent vitals indicate an excellent recovery phase. Consider increasing protein intake by 15% this session."
                </p>
                <button onClick={() => navigate('/patient/ai-symptom-checker')} className="w-full py-4 bg-white text-primary font-black rounded-2xl uppercase text-[10px] tracking-widest hover:scale-95 transition-all">Connect AI Partner</button>
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
