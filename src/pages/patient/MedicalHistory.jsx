import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import logger from '../../utils/logger';

/**
 * MedicalHistory Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function MedicalHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('medical_history')
        .select(`
          *,
          doctors (
            first_name,
            last_name,
            specialization,
            image_url
          )
        `)
        .eq('patient_id', user.id)
        .order('visit_date', { ascending: false });

      if (fetchError) throw fetchError;
      setHistory(data || []);
    } catch (err) {
      logger.error("Error fetching medical history:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMedicalHistory();
    }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const filteredHistory = history.filter(record => 
    record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctors?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctors?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 pb-24 bg-surface min-h-screen max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight leading-none mb-3">Clinical Timeline</h1>
          <p className="text-on-surface-variant font-medium">Your complete medical journey and professional consultations</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-3.5 rounded-3xl border-2 border-primary text-primary font-black hover:bg-primary/5 transition-all group uppercase tracking-widest text-xs shadow-sm">
          <span className="material-symbols-outlined text-[20px] group-hover:-translate-y-1 transition-transform">download</span>
          Secure Offline PDF
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-low p-5 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-4 mb-8 border border-outline-variant/10">
        <div className="flex-1 w-full relative">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40">search</span>
          <input 
            type="text" 
            placeholder="Filter by diagnosis, doctor or department..." 
            className="w-full pl-14 pr-6 py-4 bg-surface-container-lowest border-none rounded-3xl text-sm font-bold focus:ring-4 focus:ring-primary/5 transition-all placeholder:font-medium shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select className="flex-1 md:flex-none bg-surface-container-lowest border-none rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/5 shadow-sm">
            <option>All Years</option>
            <option>2026</option>
            <option>2025</option>
          </select>
          <button className="flex-1 md:flex-none bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20">
            Refresh
          </button>
        </div>
      </div>

      {/* Highlights / Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] flex items-start gap-5 border-l-8 border-error shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
             <span className="material-symbols-outlined text-7xl font-light">warning</span>
          </div>
          <div className="p-3 bg-red-50 text-error rounded-2xl shrink-0">
             <span className="material-symbols-outlined fill-current">emergency_home</span>
          </div>
          <div className="relative z-10">
            <h3 className="font-black text-xs text-error uppercase tracking-[0.2em] mb-4">Critical Allergies</h3>
            <div className="flex flex-wrap gap-2">
              {['Penicillin', 'Dust', 'Pollen'].map(allergy => (
                <span key={allergy} className="px-4 py-1.5 bg-red-50 text-error rounded-full text-[10px] font-black uppercase tracking-tighter border border-red-100">
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-[2rem] flex items-start gap-5 border-l-8 border-orange-400 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
             <span className="material-symbols-outlined text-7xl font-light">medical_information</span>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl shrink-0">
             <span className="material-symbols-outlined fill-current">vital_signs</span>
          </div>
          <div className="relative z-10">
            <h3 className="font-black text-xs text-orange-600 uppercase tracking-[0.2em] mb-4">Chronic Indicators</h3>
            <div className="flex flex-wrap gap-2">
              {['Hypertension', 'Type 2 Diabetes'].map(condition => (
                <span key={condition} className="px-4 py-1.5 bg-orange-50 text-orange-800 rounded-full text-[10px] font-black uppercase tracking-tighter border border-orange-100">
                  {condition}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative ml-4 md:ml-12 pl-10 md:pl-16 space-y-12 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-gradient-to-b before:from-primary/30 before:to-primary/5 before:rounded-full">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-on-surface-variant font-black uppercase tracking-widest text-[10px]">Synchronizing Timeline...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-[3rem] p-16 text-center border-2 border-dashed border-outline-variant/10 shadow-sm relative -ml-16">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-6">history_edu</span>
            <h3 className="text-2xl font-black text-on-surface uppercase tracking-tight">No clinical records found</h3>
            <p className="text-on-surface-variant font-medium max-w-xs mx-auto mt-2">Your medical journey at MediSync is just beginning.</p>
          </div>
        ) : (
          filteredHistory.map((record) => (
            <div key={record.id} className="relative group">
              {/* Timeline Indicator */}
              <div className="absolute -left-[54px] md:-left-[78px] top-6 flex items-center justify-center">
                 <div className="bg-white p-1 rounded-full shadow-lg z-20">
                    <div className="w-6 h-6 rounded-full bg-primary border-4 border-primary/20 group-hover:scale-125 transition-transform duration-500"></div>
                 </div>
                 <div className="hidden md:block absolute -left-20 w-16 text-right">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">{new Date(record.visit_date).getFullYear()}</p>
                    <p className="text-xs font-black text-on-surface uppercase tracking-tighter">{new Date(record.visit_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                 </div>
              </div>

              {/* Record Card */}
              <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-outline-variant/5 group-hover:-translate-y-1">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                  {/* Left: Metadata */}
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                         <img 
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-surface-container-high shadow-md" 
                          src={record.doctors?.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuClef_wlPZAhy5lua2Vq5Bmaoj5U3kPFh_d_HPCR7YJESvMwH09GyDhvvVERy1qaDRy2oGwNaL2VOafKQy3viee2XE5Bm7EazgEVC35LGn7gluKrlbiD9ufrOGOhNcYuTJux6jiCNstqd63ktjl4swNP6WthtW1SOBQ0iMgrU_-mCYLM-h3YW6mWC_2V1VutwdVqhfIcOmRfF3nYpeN7l7zpP2ALJ_Q0gHZmbi383D0xxjyXJGAadX1wOrxqr-qdOoaBMXAVP8jvxw"} 
                          alt={record.doctors ? `${record.doctors.first_name} ${record.doctors.last_name}` : 'Doctor'} 
                        />
                        <div>
                          <h4 className="font-extrabold text-xl text-on-surface leading-none">
                            Dr. {record.doctors ? `${record.doctors.first_name} ${record.doctors.last_name}` : 'Medical Officer'}
                          </h4>
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.1em] mt-1">{record.doctors?.specialization || 'Clinical Associate'}</p>
                        </div>
                      </div>
                      <span className="px-4 py-1 bg-surface-container-low text-on-surface-variant rounded-full text-[10px] font-black uppercase tracking-widest border border-outline-variant/10 self-start">
                        {record.visit_type || 'OPD'}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-black text-on-surface tracking-tight mb-4">{record.diagnosis || 'Routine Evaluation'}</h2>
                      <div className="flex flex-wrap gap-2">
                        {['Stable', 'Post-Op', 'Recovery'].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-surface-container-low text-on-surface-variant rounded-full text-[9px] font-bold uppercase tracking-widest">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Vitals Summary Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-surface-container-low/50 rounded-3xl border border-outline-variant/10">
                      {[
                        { label: 'Pressure', val: '120/80', icon: 'blood_pressure' },
                        { label: 'Pulse', val: '72 bpm', icon: 'favorite' },
                        { label: 'SpO2', val: '98%', icon: 'air' },
                        { label: 'Weight', val: '68 kg', icon: 'monitor_weight' },
                      ].map(vital => (
                         <div key={vital.label} className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{vital.icon}</span>
                            <div>
                               <p className="text-[8px] font-black text-on-surface-variant uppercase opacity-60 tracking-tighter">{vital.label}</p>
                               <p className="text-xs font-black text-on-surface tabular-nums leading-none">{vital.val}</p>
                            </div>
                         </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Notes & Documents */}
                  <div className="w-full lg:w-72 space-y-6">
                    <div className="bg-primary/5 p-6 rounded-[1.8rem] border border-primary/10 relative overflow-hidden group/notes">
                      <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-6xl text-primary/5 group-hover/notes:scale-125 transition-transform duration-700">notes</span>
                      <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Clinical Assessment</h5>
                      <p className="text-xs font-medium text-on-surface-variant leading-relaxed line-clamp-4 italic">
                        "{record.notes || "Comprehensive evaluation performed. Patient vital signs within normal parameters. Recommended routine follow-up in 6 months for preventive screening."}"
                      </p>
                    </div>

                    <div className="space-y-3">
                       <button className="w-full py-4 bg-white hover:bg-primary hover:text-white text-on-surface flex items-center justify-between px-6 rounded-2xl border border-outline-variant/10 shadow-sm transition-all font-black uppercase tracking-widest text-[10px] group/item">
                          Prescription PDF
                          <span className="material-symbols-outlined text-[18px] group-hover/item:translate-y-0.5 transition-transform">download_2</span>
                       </button>
                       <button className="w-full py-4 bg-white hover:bg-primary hover:text-white text-on-surface flex items-center justify-between px-6 rounded-2xl border border-outline-variant/10 shadow-sm transition-all font-black uppercase tracking-widest text-[10px] group/item">
                          Lab Analysis
                          <span className="material-symbols-outlined text-[18px] group-hover/item:translate-y-0.5 transition-transform">lab_research</span>
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

