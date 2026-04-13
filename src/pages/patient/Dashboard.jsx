import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [pendingBillsTotal, setPendingBillsTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12 min-h-screen">
      {/* Welcome Banner Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-[#8e7492] p-8 text-on-primary shadow-xl shadow-primary/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end md:items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
              Good Morning, {userProfile?.full_name?.split(' ')[0] || 'Patient'}!
            </h1>
            <p className="text-lg opacity-90 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="mt-6 inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
              <span className="font-bold">Blood Group: {userProfile?.blood_group || 'Not set'}</span>
            </div>
          </div>
          <div className="hidden lg:block relative z-10">
             <img 
               className="h-48 w-auto object-contain drop-shadow-2xl" 
               alt="Medical professional illustration" 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGq6O09pa2mopfq9X4mVjLoRkDVr_v2NsCZAVf8bN9vDqQjgqxF_nzcLcXdf9FD0wu77pECpfPGqvYDo54_K4dF0vHHA3akivEfvEVLtcyeSVy4XKRsWqGd36fVadWZHguR20PDRcX5JVGxkVPVYhJMBGYwVDnrfjphAptdaeYLDyiA3t1jcoJCWNOfyGYhyYZa6s8Wwi359PggCYTinSsdXDU8HDUaO-ATXvv1VZphmDrhdM_FAF0q4vaKij8JwKwEzvCGWWjC90"
             />
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </section>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-primary rounded-xl group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">event_upcoming</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">Upcoming Appointments</p>
          <h2 className="text-3xl font-bold mt-1 text-on-surface">{appointments.length}</h2>
          <p className="text-xs text-primary mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">schedule</span> 
            {appointments.length > 0 ? `Next: ${new Date(appointments[0].appointment_date).toLocaleDateString()}` : 'No upcoming'}
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">medication</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">Active Prescriptions</p>
          <h2 className="text-3xl font-bold mt-1 text-on-surface">2</h2>
          <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">alarm_on</span> 2 medicines due today
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">Pending Bills</p>
          <h2 className="text-3xl font-bold mt-1 text-on-surface">{pendingBillsTotal > 0 ? '1+' : '0'}</h2>
          <p className="text-xs text-error mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span> ₹{pendingBillsTotal} outstanding
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">history</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">Last Visit</p>
          <h2 className="text-xl font-bold mt-1 text-on-surface">12 Mar 2026</h2>
          <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">person</span> Dr. Sharma — Cardiology
          </p>
        </div>
      </section>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Appointments & Prescriptions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Appointments */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-on-surface">Upcoming Appointments</h2>
              <button className="text-primary text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              
              {appointments.length === 0 ? (
                <div className="bg-surface-container-lowest p-5 rounded-2xl text-center text-on-surface-variant">
                  No upcoming appointments.
                </div>
              ) : (
                appointments.map(apt => (
                  <div key={apt.id} className="bg-surface-container-lowest p-5 rounded-2xl flex items-center gap-4 group hover:bg-surface-container-low transition-all">
                    <div className="w-16 h-16 rounded-xl bg-primary-container/30 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-3xl">person</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-on-surface">{apt.doctors?.full_name || 'Doctor'}</h4>
                      <p className="text-xs text-on-surface-variant">{apt.department || apt.doctors?.specialization} • <span className="text-green-600 font-medium capitalize">{apt.status}</span></p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {new Date(apt.appointment_date).toDateString()} • {apt.time_slot}
                      </p>
                    </div>
                    <div className="flex gap-2">
                       <button className="px-3 py-2 bg-surface-container-high text-on-surface text-xs font-bold rounded-lg hover:bg-outline-variant transition-colors">Reschedule</button>
                      <button className="px-3 py-2 bg-error-container text-on-error-container text-xs font-bold rounded-lg hover:bg-error/10 transition-colors">Cancel</button>
                    </div>
                  </div>
                ))
              )}

            </div>
          </section>

          {/* Prescriptions */}
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-6">Active Prescriptions</h2>
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-bold text-on-surface">Amoxicillin 500mg</h4>
                      <p className="text-xs text-on-surface-variant">1 capsule, 3 times a day</p>
                    </div>
                    <span className="text-xs font-bold text-error">3 days left</span>
                  </div>
                  <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-error" style={{ width: '70%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-bold text-on-surface">Lisinopril 10mg</h4>
                      <p className="text-xs text-on-surface-variant">1 tablet, every morning</p>
                    </div>
                    <span className="text-xs font-bold text-green-600">12 days left</span>
                  </div>
                  <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-low p-4 text-center">
                <button className="text-primary text-sm font-bold flex items-center justify-center gap-2 w-full hover:underline">
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  Request Refill
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Vitals & AI Tip & Quick Actions */}
        <div className="space-y-8">
          {/* Vitals */}
          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Recent Vitals</h2>
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </div>
                    <span className="text-sm font-medium text-on-surface-variant">Blood Pressure</span>
                  </div>
                  <span className="text-lg font-bold text-on-surface">120/80</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pulse_alert</span>
                    </div>
                    <span className="text-sm font-medium text-on-surface-variant">Pulse Rate</span>
                  </div>
                  <span className="text-lg font-bold text-on-surface">72 bpm</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                      <span className="material-symbols-outlined">thermostat</span>
                    </div>
                    <span className="text-sm font-medium text-on-surface-variant">Body Temp</span>
                  </div>
                  <span className="text-lg font-bold text-on-surface">98.6°F</span>
                </div>
              </div>
            </div>
          </section>

          {/* AI Health Tip */}
          <section className="bg-gradient-to-br from-purple-100 to-white dark:from-purple-900/20 dark:to-zinc-900 p-6 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-lg shadow-purple-500/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <h3 className="font-bold text-primary">Today's Health Tip</h3>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              Stay hydrated! Aim for at least 3 liters of water today to improve your energy levels and help with your recent BP readings.
            </p>
            <button className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl hover:scale-[0.98] transition-transform active:opacity-80">
              Ask AI More
            </button>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-surface-container-lowest rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-primary-container/20 transition-all group shadow-sm border border-transparent hover:border-primary-container">
                <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">add_circle</span>
                <span className="text-xs font-bold text-on-surface">Book Appt</span>
              </button>
              <button className="p-4 bg-surface-container-lowest rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-primary-container/20 transition-all group shadow-sm border border-transparent hover:border-primary-container">
                <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">chat</span>
                <span className="text-xs font-bold text-on-surface">AI Consult</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    );
};

export default Dashboard;
