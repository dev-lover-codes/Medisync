import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [pendingBillsTotal, setPendingBillsTotal] = useState(0);
  const [loading, setLoading] = useState(!user); // Start loading if user isn't available yet


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
          .select('*, doctors(full_name, specialization)')
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12 min-h-screen">
      {/* Welcome Banner Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#4A3D4E] via-[#6A5A6E] to-[#4A3D4E] p-8 md:p-12 text-on-primary shadow-2xl shadow-primary/20 border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live Health Status: Stable
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
              Welcome back, <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                {userProfile?.full_name?.split(' ')[0] || 'Patient'}
              </span>!
            </h1>
            <p className="text-lg opacity-80 font-medium max-w-md">
              Your health journey is looking great. You have {appointments.length} upcoming appointments this week.
            </p>
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/10">
                <span className="material-symbols-outlined text-blue-300">water_drop</span>
                <span className="font-bold">Blood: {userProfile?.blood_group || 'O+'}</span>
              </div>
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/10">
                <span className="material-symbols-outlined text-red-300">favorite</span>
                <span className="font-bold">Focus: Recovery</span>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-full blur-2xl group-hover:opacity-75 transition-opacity"></div>
            <img 
               className="h-56 md:h-64 w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 transition-transform hover:scale-105 duration-500" 
               alt="Medical professional illustration" 
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
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-outline/5 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <span className="material-symbols-outlined">event_upcoming</span>
            </div>
            <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">+2 new</div>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">Appointments</p>
          <h2 className="text-3xl font-black mt-1 text-on-surface">{appointments.length}</h2>
          <div className="mt-4 pt-4 border-t border-outline/5">
            <p className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span> 
              {appointments.length > 0 ? `Next: ${new Date(appointments[0].appointment_date).toLocaleDateString()}` : 'None scheduled'}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-outline/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <span className="material-symbols-outlined">medication</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">Active Meds</p>
          <h2 className="text-3xl font-black mt-1 text-on-surface">3</h2>
          <div className="mt-4 pt-4 border-t border-outline/5">
            <p className="text-xs text-blue-600 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px] fill-current">alarm</span> Next dose in 4h
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-outline/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
              <span className="material-symbols-outlined">payments</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">Payments</p>
          <h2 className="text-3xl font-black mt-1 text-on-surface">₹{pendingBillsTotal}</h2>
          <div className="mt-4 pt-4 border-t border-outline/5">
            <p className="text-xs text-error flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[14px]">warning</span> Action required
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-outline/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
              <span className="material-symbols-outlined">ecg</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">Health Score</p>
          <h2 className="text-3xl font-black mt-1 text-on-surface">92<span className="text-sm font-medium text-on-surface-variant ml-1">/100</span></h2>
          <div className="mt-4 pt-4 border-t border-outline/5">
            <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
               <div className="h-full bg-green-500" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
      </section>


      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Appointments & Prescriptions */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* New Panel: Health Analytics & Goals Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline/5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">Daily Activity</h2>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Efficiency Metrics</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">leaderboard</span>
                </div>
              </div>
              <div className="h-40 flex items-end justify-between gap-2 px-1">
                {[45, 62, 53, 85, 71, 93, 88].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-full relative flex flex-col items-center">
                      <div className="w-2 md:w-3 bg-surface-container-high rounded-full h-32 relative overflow-hidden">
                        <div 
                          className="absolute bottom-0 w-full bg-primary rounded-full transition-all duration-1000 group-hover:bg-primary-container" 
                          style={{ height: `${val}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-on-surface-variant">D{i+1}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline/5 relative overflow-hidden">
              <h2 className="text-xl font-bold text-on-surface mb-6">Treatment Plan</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-surface-container-low border border-outline/5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">fitness_center</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold">Physical Therapy</span>
                      <span className="text-xs text-blue-600 font-black">60%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-surface-container-low border border-outline/5">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">nutrition</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold">Medication Cycle</span>
                      <span className="text-xs text-orange-600 font-black">85%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center">
                <button className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline">Full Recovery Roadmap →</button>
              </div>
            </section>
          </div>


          {/* Appointments */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-on-surface">Scheduled Visits</h2>
              <Link to="/patient/appointments" className="px-4 py-1.5 bg-surface-container-high rounded-full text-primary text-xs font-bold hover:bg-primary/10 transition-colors">View All List</Link>
            </div>
            <div className="space-y-4">
              
              {appointments.length === 0 ? (
                <div className="bg-surface-container-lowest p-10 rounded-3xl text-center border-2 border-dashed border-outline/10">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">calendar_today</span>
                  <p className="text-on-surface-variant font-medium">No upcoming appointments found.</p>
                  <button onClick={() => navigate('/patient/book-appointment')} className="mt-4 text-primary font-bold text-sm">Schedule Now →</button>
                </div>
              ) : (
                appointments.map(apt => (
                  <div key={apt.id} className="bg-surface-container-lowest p-5 rounded-3xl flex items-center gap-5 group hover:shadow-lg transition-all border border-outline/5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl">person</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-extrabold text-on-surface">{apt.doctors?.full_name || 'Dr. Arjun Mehta'}</h4>
                      <p className="text-xs text-on-surface-variant font-medium mb-2">{apt.department || apt.doctors?.specialization || 'General Consultation'}</p>
                      <div className="flex flex-wrap gap-3">
                         <span className="flex items-center gap-1 text-[10px] font-bold py-1 px-2 rounded-lg bg-surface-container-high">
                           <span className="material-symbols-outlined text-[14px]">event</span>
                           {new Date(apt.appointment_date).toDateString()}
                         </span>
                         <span className="flex items-center gap-1 text-[10px] font-bold py-1 px-2 rounded-lg bg-surface-container-high">
                           <span className="material-symbols-outlined text-[14px]">schedule</span>
                           {apt.time_slot}
                         </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex gap-2">
                      <button className="w-10 h-10 flex items-center justify-center bg-surface-container-high text-on-surface rounded-xl hover:bg-primary/10 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">video_call</span>
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center bg-surface-container-high text-on-surface rounded-xl hover:bg-primary/10 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                      </button>
                    </div>
                  </div>
                ))
              )}

            </div>
          </section>

          {/* New Panel: Lab Test Results */}
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-6">Recent Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-5 rounded-[1.5rem] border border-outline/5 hover:border-primary/20 transition-colors">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-purple-50 text-primary rounded-xl">
                     <span className="material-symbols-outlined">lab_research</span>
                   </div>
                   <span className="text-[10px] font-black py-1 px-2 bg-green-100 text-green-700 rounded-lg">NORMAL</span>
                </div>
                <h4 className="font-bold text-on-surface">CBC Report</h4>
                <p className="text-xs text-on-surface-variant mb-4">Last checked: 2 days ago</p>
                <button className="w-full py-2 bg-surface-container-high rounded-xl text-xs font-bold hover:bg-outline-variant transition-colors">Download PDF</button>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-[1.5rem] border border-outline/5 hover:border-primary/20 transition-colors">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                     <span className="material-symbols-outlined">biomedical_extraction</span>
                   </div>
                   <span className="text-[10px] font-black py-1 px-2 bg-orange-100 text-orange-700 rounded-lg">PENDING</span>
                </div>
                <h4 className="font-bold text-on-surface">MRI Scan (Head)</h4>
                <p className="text-xs text-on-surface-variant mb-4">Scheduled for tomorrow</p>
                <button className="w-full py-2 bg-surface-container-high rounded-xl text-xs font-bold hover:bg-outline-variant transition-colors">View Details</button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Vitals & AI Tip & Quick Actions */}
        <div className="space-y-10">
          {/* Vitals */}
          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Real-time Vitals</h2>
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline/5">
              <div className="space-y-6">
                <div className="group cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-on-surface">Blood Pressure</span>
                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Normal Range</p>
                      </div>
                    </div>
                    <span className="text-xl font-black text-on-surface">120/80</span>
                  </div>
                </div>

                <div className="group cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pulse_alert</span>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-on-surface">Heart Rate</span>
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Active State</p>
                      </div>
                    </div>
                    <span className="text-xl font-black text-on-surface">78 <span className="text-xs">bpm</span></span>
                  </div>
                </div>

                <div className="group cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">thermostat</span>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-on-surface">Temperature</span>
                        <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">Stable</p>
                      </div>
                    </div>
                    <span className="text-xl font-black text-on-surface">98.6<span className="text-xs">°F</span></span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-8 py-3 bg-surface-container-high rounded-2xl text-sm font-extrabold hover:bg-primary/5 transition-colors border border-outline/5">Update Vitals</button>
            </div>
          </section>

          {/* AI Health Tip - Enhanced Style */}
          <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#6A5A6E] to-primary p-1 rounded-[2.5rem] shadow-xl group">
            <div className="bg-surface-container-lowest dark:bg-[#1A181B] p-8 rounded-[2.4rem] h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
                <div>
                  <h3 className="font-black text-primary uppercase tracking-wider text-xs">Medi-AI Assistant</h3>
                  <p className="font-bold text-on-surface">Daily Insight</p>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-8 italic">
                "Your heart rate variability is up by 12% today. This is a great sign of recovery. Keep up the hydration levels and try a 10-minute meditation before sleep."
              </p>
              <button onClick={() => navigate('/patient/ai-symptom-checker')} className="w-full py-4 bg-primary text-on-primary font-black rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-primary/20">
                Ask AI Assistant
                <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_right_alt</span>
              </button>
            </div>
            {/* Background glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none group-hover:w-64 group-hover:h-64 transition-all duration-700"></div>
          </section>

          {/* Quick Actions - Polished */}
          <section>
            <h2 className="text-xl font-bold text-on-surface mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Book Visit', icon: 'medical_services', color: 'text-primary', path: '/patient/book-appointment' },
                { label: 'AI Check', icon: 'psychology', color: 'text-blue-500', path: '/patient/ai-symptom-checker' },
                { label: 'Refill', icon: 'pill', color: 'text-orange-500', path: '/patient/prescriptions' },
                { label: 'Pay Bills', icon: 'account_balance_wallet', color: 'text-green-500', path: '/patient/bills' },
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => navigate(action.path)} 
                  className="p-6 bg-surface-container-lowest rounded-[1.8rem] flex flex-col items-center justify-center gap-3 hover:bg-surface-container-high transition-all border border-outline/5 hover:shadow-md group"
                >
                  <span className={`material-symbols-outlined text-3xl ${action.color} group-hover:scale-110 transition-transform`}>{action.icon}</span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant">{action.label}</span>
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
