import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

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
        // Fetch Appointments
        const { data: aptData, error: aptError } = await supabase
          .from('appointments')
          .select('*, doctors(full_name, specialization, image_url)')
          .eq('patient_id', user.id)
          .eq('status', 'upcoming')
          .order('appointment_date', { ascending: true })
          .limit(3);

        if (!aptError && aptData) setAppointments(aptData);

        // Fetch pending bill total
        const { data: billData, error: billError } = await supabase
          .from('bills')
          .select('total_amount')
          .eq('patient_id', user.id)
          .eq('status', 'pending');

        if (!billError && billData) {
          const total = billData.reduce((sum, bill) => sum + (Number(bill.total_amount) || 0), 0);
          setPendingBillsTotal(total);
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading && !user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-surface-container-low">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-primary font-medium">Preparing your health dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Welcome Banner Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-[#8e7492] to-primary p-8 md:p-12 text-on-primary shadow-2xl shadow-primary/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
              Good Morning, <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-fixed">
                {userProfile?.full_name?.split(' ')[0] || 'Sarah'}
              </span>!
            </h1>
            <p className="text-lg opacity-90 font-medium">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
                <span className="material-symbols-outlined fill-current">water_drop</span>
                <span className="font-bold font-headline">Blood Group: {userProfile?.blood_group || 'O+'}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-10 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <img 
              className="h-56 md:h-64 w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative z-10 transition-transform hover:scale-105 duration-500" 
              alt="Medical professional 3D" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGq6O09pa2mopfq9X4mVjLoRkDVr_v2NsCZAVf8bN9vDqQjgqxF_nzcLcXdf9FD0wu77pECpfPGqvYDo54_K4dF0vHHA3akivEfvEVLtcyeSVy4XKRsWqGd36fVadWZHguR20PDRcX5JVGxkVPVYhJMBGYwVDnrfjphAptdaeYLDyiA3t1jcoJCWNOfyGYhyYZa6s8Wwi359PggCYTinSsdXDU8HDUaO-ATXvv1VZphmDrhdM_FAF0q4vaKij8JwKwEzvCGWWjC90"
            />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
      </section>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">event_upcoming</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Upcoming Appointments</p>
          <h2 className="text-4xl font-extrabold mt-1 text-on-surface">{appointments.length}</h2>
          <p className="text-xs text-primary mt-2 flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[14px]">schedule</span> 
            {appointments.length > 0 ? `Next: ${new Date(appointments[0].appointment_date).toLocaleDateString()}` : 'No upcoming'}
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <span className="material-symbols-outlined">medication</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Active Prescriptions</p>
          <h2 className="text-4xl font-extrabold mt-1 text-on-surface">3</h2>
          <p className="text-xs text-blue-600 mt-2 flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[14px]">alarm_on</span> doses due today
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Pending Bills</p>
          <h2 className="text-4xl font-extrabold mt-1 text-on-surface">₹{pendingBillsTotal}</h2>
          <p className="text-xs text-error mt-2 flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[14px]">error</span> Payment Required
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
              <span className="material-symbols-outlined">history</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Last Visit</p>
          <h2 className="text-xl font-extrabold mt-1 text-on-surface">12 Mar 2026</h2>
          <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1 font-bold">
            Dr. Sharma • Cardiology
          </p>
        </div>
      </section>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Appointments & Prescriptions */}
        <div className="lg:col-span-2 space-y-10">
          {/* Appointments */}
          <section>
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-2xl font-black text-on-surface">Upcoming Scheduled Visits</h2>
              <Link to="/patient/appointments" className="text-primary text-sm font-black hover:underline uppercase tracking-widest px-4 py-2 bg-primary/5 rounded-full">View All</Link>
            </div>
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="bg-surface-container-lowest p-12 rounded-[2rem] text-center border-2 border-dashed border-outline-variant/20">
                  <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">event_busy</span>
                  <p className="text-on-surface-variant font-bold">No upcoming appointments.</p>
                  <button onClick={() => navigate('/patient/book-appointment')} className="mt-6 btn btn-primary">Schedule Now</button>
                </div>
              ) : (
                appointments.map((apt) => (
                  <div key={apt.id} className="bg-surface-container-lowest p-5 rounded-[1.5rem] flex items-center gap-5 group hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant/20 shadow-sm hover:shadow-md">
                    <img 
                      className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-surface-container-high" 
                      alt={apt.doctors?.full_name}
                      src={apt.doctors?.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuClef_wlPZAhy5lua2Vq5Bmaoj5U3kPFh_d_HPCR7YJESvMwH09GyDhvvVERy1qaDRy2oGwNaL2VOafKQy3viee2XE5Bm7EazgEVC35LGn7gluKrlbiD9ufrOGOhNcYuTJux6jiCNstqd63ktjl4swNP6WthtW1SOBQ0iMgrU_-mCYLM-h3YW6mWC_2V1VutwdVqhfIcOmRfF3nYpeN7l7zpP2ALJ_Q0gHZmbi383D0xxjyXJGAadX1wOrxqr-qdOoaBMXAVP8jvxw"}
                    />
                    <div className="flex-1">
                      <h4 className="font-extrabold text-on-surface text-lg">Dr. {apt.doctors?.full_name}</h4>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{apt.doctors?.specialization || 'Neurology'}</span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${apt.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {apt.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                        {new Date(apt.appointment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {apt.time_slot}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-3 bg-surface-container-high text-on-surface rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group/btn">
                        <span className="material-symbols-outlined group-hover/btn:scale-110 transition-transform">edit_calendar</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Active Prescriptions */}
          <section>
            <h2 className="text-2xl font-black text-on-surface mb-6 px-2">Active Health Regimen</h2>
            <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm border border-outline-variant/10">
              <div className="p-8 space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-extrabold text-on-surface">Amoxicillin 500mg</h4>
                      <p className="text-xs text-on-surface-variant font-bold">1 capsule, 3 times a day</p>
                    </div>
                    <span className="text-xs font-black text-error bg-error/10 px-3 py-1 rounded-full uppercase tracking-widest">3 days left</span>
                  </div>
                  <div className="h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                    <div className="h-full bg-error" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-extrabold text-on-surface">Lisinopril 10mg</h4>
                      <p className="text-xs text-on-surface-variant font-bold">1 tablet, every morning</p>
                    </div>
                    <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">12 days left</span>
                  </div>
                  <div className="h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-low p-5">
                <button className="w-full btn bg-white text-primary font-black hover:bg-primary hover:text-white border-2 border-primary/10">
                  <span className="material-symbols-outlined text-[18px] mr-2">receipt_long</span>
                  Request Refill
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Vitals & AI Tip */}
        <div className="space-y-10">
          {/* Recent Vitals */}
          <section>
            <h2 className="text-xl font-bold font-manrope text-on-surface mb-6">Biometric Vitals</h2>
            <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10 space-y-6">
              {[
                { label: 'Blood Pressure', value: '120/80', icon: 'favorite', color: 'bg-red-50 text-red-500' },
                { label: 'Pulse Rate', value: '72 bpm', icon: 'pulse_alert', color: 'bg-blue-50 text-blue-500' },
                { label: 'Body Temp', value: '98.6°F', icon: 'thermostat', color: 'bg-orange-50 text-orange-500' },
                { label: 'Weight', value: '68 kg', icon: 'monitor_weight', color: 'bg-purple-50 text-purple-500' },
                { label: 'SpO2', value: '98%', icon: 'air', color: 'bg-cyan-50 text-cyan-500' },
              ].map((vital, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${vital.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{vital.icon}</span>
                    </div>
                    <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest leading-none">{vital.label}</span>
                  </div>
                  <span className="text-xl font-black text-on-surface tabular-nums">{vital.value}</span>
                </div>
              ))}
              <button className="w-full mt-4 py-4 bg-surface-container-low rounded-[1.5rem] text-sm font-black text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all uppercase tracking-widest border border-outline-variant/10">Update Metrics</button>
            </div>
          </section>

          {/* AI Health Tip */}
          <section className="relative overflow-hidden bg-gradient-to-br from-purple-100 to-white p-8 rounded-[2.5rem] border border-purple-200 shadow-lg shadow-purple-500/5 group">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
                <div>
                  <h3 className="font-black text-primary uppercase tracking-widest text-xs">AI Counsel</h3>
                  <p className="font-bold text-on-surface">Daily Wellness Insight</p>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-8 italic font-medium">
                "Stay hydrated, Sarah! Your recent vitals suggest that increasing your water intake to 3L today will significantly boost your metabolic recovery."
              </p>
              <button onClick={() => navigate('/patient/ai-symptom-checker')} className="w-full py-4 bg-primary text-on-primary font-black rounded-2xl hover:bg-primary-container transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group/btn">
                Ask MediSync AI
                <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-bold font-manrope text-on-surface mb-6">Clinical Portal</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Book Visit', icon: 'medical_services', color: 'text-primary', path: '/patient/book-appointment' },
                { label: 'Chat AI', icon: 'psychology', color: 'text-blue-500', path: '/patient/ai-symptom-checker' },
                { label: 'Records', icon: 'folder_open', color: 'text-orange-500', path: '/patient/medical-history' },
                { label: 'Finances', icon: 'account_balance_wallet', color: 'text-green-500', path: '/patient/bills' },
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => navigate(action.path)} 
                  className="p-6 bg-surface-container-lowest rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-surface-container-low transition-all border border-outline-variant/10 group shadow-sm"
                >
                  <span className={`material-symbols-outlined text-4xl ${action.color} group-hover:scale-110 transition-transform`}>{action.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

