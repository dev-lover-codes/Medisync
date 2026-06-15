import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import logger from '../../utils/logger';

/**
 * Prescriptions Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function Prescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('prescriptions')
        .select(`
          *,
          doctors (
            first_name,
            last_name,
            specialization,
            image_url
          ),
          prescription_items (*)
        `)
        .eq('patient_id', user.id);

      const now = new Date().toISOString();
      if (activeTab === 'active') {
        query = query.gt('valid_until', now).order('created_at', { ascending: false });
      } else {
        query = query.lte('valid_until', now).order('created_at', { ascending: false });
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPrescriptions(data || []);
    } catch (err) {
      logger.error("Error fetching prescriptions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPrescriptions();
    }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeTab]);

  /**
 * requestRefill internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const requestRefill = () => {
    alert("Digital refill request has been transmitted to your physician's portal.");
  };

  return (
    <div className="p-4 md:p-8 pb-24 bg-surface min-h-screen max-w-6xl mx-auto">
      {/* Header & Control Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight leading-none mb-3">Medication Vault</h1>
          <p className="text-on-surface-variant font-medium">Digital prescriptions, dosage tracking, and pharmacy integration</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              Order Pharmacy Delivery
           </button>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-10 mb-10 border-b border-surface-container-high overflow-x-auto no-scrollbar">
        {['active', 'past archive'].map((tab) => {
          const tabKey = tab.split(' ')[0];
          return (
            <button 
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`pb-5 border-b-4 font-black flex items-center gap-3 transition-all whitespace-nowrap uppercase tracking-[0.15em] text-[11px] ${
                activeTab === tabKey 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-on-surface-variant hover:text-primary opacity-60'
              }`}
            >
              {tab}
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${activeTab === tabKey ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
                {activeTab === tabKey ? prescriptions.length : '—'}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error px-6 py-4 rounded-2xl mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <p className="font-bold">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center py-20 bg-surface-container-lowest rounded-[3rem] border-2 border-dashed border-outline-variant/10">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-on-surface-variant font-black uppercase tracking-widest text-[10px]">Accessing Vault Records...</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-[3rem] p-16 text-center border-2 border-dashed border-outline-variant/20 shadow-sm">
          <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">pill_off</span>
          </div>
          <h3 className="text-2xl font-black text-on-surface uppercase tracking-tight">No {activeTab} prescriptions found</h3>
          <p className="text-on-surface-variant font-medium mb-8 max-w-sm mx-auto">Your pharmacy records are currently clear. Please contact your physician if you expect new digital scripts.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {prescriptions.map((px) => {
            const isExpired = new Date(px.valid_until) < new Date();
            
            return (
              <div key={px.id} className="bg-surface-container-lowest rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-outline-variant/5">
                {/* Visual Accent Strip */}
                <div className={`h-2 w-full ${isExpired ? 'bg-outline-variant' : 'bg-gradient-to-r from-primary via-[#8e7492] to-primary'}`}></div>

                <div className="p-8">
                  {/* Card Header Info */}
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
                    <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
                      <div className="w-20 h-20 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary shrink-0 relative">
                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>prescriptions</span>
                        {!isExpired && <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h3 className="font-headline font-black text-2xl text-on-surface tracking-tight leading-none uppercase">RX-{px.id.slice(0, 8)}</h3>
                           <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isExpired ? 'bg-surface-container-high text-on-surface-variant border border-outline-variant/10' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                             {isExpired ? 'Historical' : 'Live Prescription'}
                           </span>
                        </div>
                        <div className="flex flex-wrap gap-5">
                          <span className="text-[10px] font-black text-on-surface-variant/60 flex items-center gap-2 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
                            Issued: {new Date(px.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] font-black text-on-surface-variant/60 flex items-center gap-2 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-lg">event_available</span>
                            Valid Until: {new Date(px.valid_until).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex gap-3">
                       <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-surface-container-low text-on-surface rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-outline-variant transition-all border border-outline-variant/10">
                          <span className="material-symbols-outlined text-[18px]">download</span>
                          Clinical PDF
                       </button>
                       {!isExpired && (
                         <button 
                           onClick={() => requestRefill(px.id)}
                           className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-primary/10 text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all border border-primary/20"
                         >
                            Digital Refill
                         </button>
                       )}
                    </div>
                  </div>

                  {/* Physician Context Overlay */}
                  <div className="flex items-center gap-4 mb-10 p-5 rounded-3xl bg-surface-container-low/40 border border-outline-variant/5 group cursor-default">
                    <img className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-110" src={px.doctors?.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuClef_wlPZAhy5lua2Vq5Bmaoj5U3kPFh_d_HPCR7YJESvMwH09GyDhvvVERy1qaDRy2oGwNaL2VOafKQy3viee2XE5Bm7EazgEVC35LGn7gluKrlbiD9ufrOGOhNcYuTJux6jiCNstqd63ktjl4swNP6WthtW1SOBQ0iMgrU_-mCYLM-h3YW6mWC_2V1VutwdVqhfIcOmRfF3nYpeN7l7zpP2ALJ_Q0gHZmbi383D0xxjyXJGAadX1wOrxqr-qdOoaBMXAVP8jvxw"} alt={px.doctors ? `${px.doctors.first_name} ${px.doctors.last_name}` : 'Doctor'} />
                    <div>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-0.5 opacity-60">Attending Physician</p>
                      <p className="font-black text-on-surface tracking-tight">Dr. {px.doctors ? `${px.doctors.first_name} ${px.doctors.last_name}` : 'Specialist'} <span className="font-bold text-on-surface-variant/40 ml-2 uppercase text-[10px] tracking-normal">• {px.doctors?.specialization}</span></p>
                    </div>
                  </div>

                  {/* Medication Inventory Table */}
                  <div className="mb-10 overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-surface-container-low/30 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.15em]">
                            <th className="py-5 px-8">Medicine Formulation</th>
                            <th className="py-5 px-4 text-center">Dosage</th>
                            <th className="py-5 px-4 text-center">Protocol</th>
                            <th className="py-5 px-4 text-center">Timeline</th>
                            <th className="py-5 px-8 text-right">Instruction</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm font-bold">
                          {px.prescription_items?.map((item) => (
                            <tr key={item.id} className="border-t border-surface-container-low hover:bg-surface-container-low/20 transition-colors">
                              <td className="py-6 px-8">
                                <div className="text-on-surface text-lg font-black tracking-tight">{item.medicine_name}</div>
                                <div className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest opacity-60">Systemic Pharmacon</div>
                              </td>
                              <td className="py-6 px-4 text-center tabular-nums text-on-surface-variant">{item.dosage}</td>
                              <td className="py-6 px-4 text-center text-on-surface-variant uppercase text-xs tracking-tighter">{item.frequency}</td>
                              <td className="py-6 px-4 text-center text-on-surface-variant font-black">{item.duration}</td>
                              <td className="py-6 px-8 text-right">
                                <span className="px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-tighter border border-primary/10">
                                   Oral Application
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Progress & Compliance Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <h4 className="font-black text-xs text-on-surface uppercase tracking-[0.2em] flex items-center gap-3">
                         <span className="material-symbols-outlined text-primary">analytics</span>
                         Active Course Tracking
                       </h4>
                       <div className="space-y-5">
                          {px.prescription_items?.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="group">
                              <div className="flex justify-between items-end mb-2.5">
                                 <div>
                                   <p className="text-xs font-black text-on-surface uppercase tracking-tight leading-none mb-1">{item.medicine_name}</p>
                                   <p className="text-[10px] text-on-surface-variant font-medium opacity-60 uppercase">Adherence Level: High</p>
                                 </div>
                                 <p className="text-[10px] font-black text-primary uppercase tracking-widest">{idx === 0 ? 'Residual Course: 5 days' : 'Residual Course: 2 days'}</p>
                              </div>
                              <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/10 shadow-inner">
                                 <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-1000 group-hover:opacity-80" style={{ width: idx === 0 ? '70%' : '40%' }}></div>
                              </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-surface-container-low/40 rounded-[2rem] p-8 border border-outline-variant/5">
                       <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                               <span className="material-symbols-outlined text-xl">notifications_active</span>
                            </div>
                            <h4 className="font-black text-xs text-on-surface uppercase tracking-[0.2em]">Dosage Reminders</h4>
                          </div>
                          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100 italic">Sync Active</span>
                       </div>
                       <div className="flex gap-3">
                          {[
                            { label: 'Morning', time: '08:00 AM', icon: 'light_mode', active: true },
                            { label: 'Mid-Day', time: '01:30 PM', icon: 'wb_sunny', active: false },
                            { label: 'Night', time: '09:00 PM', icon: 'dark_mode', active: true },
                          ].map(rem => (
                            <div key={rem.label} className={`flex-1 py-4 bg-white border rounded-2xl flex flex-col items-center gap-2 shadow-sm transition-all hover:border-primary/40 cursor-default ${rem.active ? 'border-primary/20' : 'border-outline-variant/20 opacity-40'}`}>
                               <span className={`material-symbols-outlined text-lg ${rem.active ? 'text-primary' : 'text-on-surface-variant'}`}>{rem.icon}</span>
                               <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest leading-none">{rem.label}</span>
                               <span className={`text-[10px] font-black ${rem.active ? 'text-primary' : 'text-on-surface-variant'}`}>{rem.time}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>

                  {px.notes && (
                    <div className="mt-10 p-6 bg-primary/5 rounded-[1.8rem] border border-primary/10 relative overflow-hidden italic text-on-surface-variant text-sm font-medium leading-relaxed group/note">
                       <span className="material-symbols-outlined absolute -top-4 -left-4 text-7xl text-primary/5 group-hover/note:scale-125 transition-transform duration-700">format_quote</span>
                       <span className="relative z-10 block pr-12">"{px.notes}"</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Supplemental Context Area */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative overflow-hidden rounded-[3rem] p-10 bg-on-surface group shadow-2xl">
           <div className="absolute inset-0 opacity-20 pointer-events-none">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBESu5c2lEsQSbyt8Nf-p7An1vLLMJQQI97RwGxG7l58eoElKsYm0gl7X1bv0ZgOzk60Ow55QyfZXXrWaPH3pkvPgHwHKQylKYYyMIwc1UgEY5o14V6rMb6deO2MraXXJRXznCg_ZnoRZdehc-BQ0lvsY8NSRVNGKVtEObuS0kGAutDpDz4yS2RplJmMyzwUBquznYknLTAkdNwP3J-i6efY0YyJvO5OfJ6voG54ubsKKe-YTMwjY0MXC5HQTkw6o0R7oiv_BzXss8" alt="Medical backdrop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
           </div>
           <div className="relative z-10 flex flex-col h-full justify-between items-start">
             <div>
                <h3 className="font-black text-3xl text-white mb-4 leading-tight tracking-tight">Rapid Pharmacy <br/>Automation</h3>
                <p className="text-white/70 font-medium text-sm max-w-xs leading-relaxed">Instantly transmit your verified digital script to 500+ partner pharmacies for same-hour dispatch.</p>
             </div>
             <button className="mt-12 py-4 px-10 bg-white text-on-surface font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-primary-container transition-all active:scale-95 shadow-xl">
                Configure Pharmacy Hub
             </button>
           </div>
        </div>

        <div className="bg-gradient-to-br from-primary via-[#8e7492] to-primary p-12 rounded-[3rem] text-white flex flex-col justify-between items-start shadow-2xl relative overflow-hidden group">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-[80px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
           <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center mb-8 backdrop-blur-md">
              <span className="material-symbols-outlined text-4xl">video_chat</span>
           </div>
           <div>
              <h3 className="font-black text-3xl mb-4 leading-tight tracking-tight leading-none">Confused about <br/>your dosage?</h3>
              <p className="text-white/80 font-medium text-sm leading-relaxed max-w-sm">Schedule a 10-minute rapid review with our AI specialist or your attending physician to clarify any protocol concerns.</p>
           </div>
           <button className="mt-12 w-full py-4 bg-white/20 hover:bg-white/30 border border-white/30 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all text-center backdrop-blur-md active:scale-95">
              Talk to Clinical Lead
           </button>
        </div>
      </div>
    </div>
  );
}

