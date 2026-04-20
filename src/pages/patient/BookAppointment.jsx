import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * BookAppointment Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function BookAppointment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingDocs, setFetchingDocs] = useState(true);
  
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  
  const [formData, setFormData] = useState({
    department: '',
    doctor_id: '',
    appointment_date: '',
    time_slot: '',
    reason: ''
  });

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  useEffect(() => {
    fetchInitialData();
    fetchUpcomingAppointments();
  }, [user]);

  const fetchUpcomingAppointments = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, doctors(first_name, last_name, specialization, image_url)')
        .eq('patient_id', user.id)
        .eq('status', 'upcoming')
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const fetchInitialData = async () => {
    try {
      setFetchingDocs(true);
      setFetchError(null);

      if (!supabase) {
        setDoctors([]);
        setFetchingDocs(false);
        return;
      }

      // Fetch all active doctors
      const { data: docData, error: docError } = await supabase
        .from('doctors')
        .select('*, departments(department_name)'); 

      if (docError) throw docError;
      
      const docs = (docData || []).map(d => ({
        ...d,
        id: d.doctor_id || d.id,
        full_name: d.full_name || `${d.first_name} ${d.last_name}`,
        department: d.department || d.specialization || "General"
      }));

      setDoctors(docs);
      
      const depts = [...new Set(docs.map(d => d.department))];
      setDepartments(depts);
      
      if (depts.length > 0) {
        setFormData(prev => ({ ...prev, department: depts[0] }));
      }
    } catch (err) {
      console.error("Error fetching initial data:", err);
      setFetchError(err.message);
    } finally {
      setFetchingDocs(false);
    }
  };

  /**
 * handleNext internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const handleNext = () => {
    if (step === 1 && (!formData.department || !formData.doctor_id)) return;
    if (step === 2 && (!formData.appointment_date || !formData.time_slot)) return;
    setStep(prev => prev + 1);
  };

  /**
 * handleBack internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!formData.reason) return;
    
    try {
      setLoading(true);
      const selectedDoc = doctors.find(d => d.id === formData.doctor_id);
      const fee = selectedDoc ? selectedDoc.consultation_fee : 0;
      
      const { error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: user.id,
          doctor_id: formData.doctor_id,
          appointment_date: formData.appointment_date,
          appointment_time: formData.time_slot,
          reason: formData.reason,
          consultation_fee: fee,
          status: 'upcoming'
        }]);

      if (error) throw error;
      navigate('/patient/appointments');
      
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Failed to book: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(d => d.department === formData.department);
  const selectedDoctorInfo = doctors.find(d => d.id === formData.doctor_id);

  if (fetchingDocs) {
    return (
      <div className="p-8 flex flex-col justify-center items-center h-screen bg-surface">
        {fetchError ? (
          <div className="text-center space-y-4">
             <span className="material-symbols-outlined text-error text-5xl font-black">error</span>
             <h2 className="text-xl font-black text-on-surface uppercase tracking-widest">Protocol Sync Failure</h2>
             <p className="text-on-surface-variant max-w-sm text-[11px] font-black leading-relaxed">{fetchError}</p>
             <button onClick={fetchInitialData} className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/40 active:scale-95 transition-all">Retry Synchronization</button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin mb-8"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 animate-pulse">Initializing clinician grid</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pb-48 bg-surface min-h-screen font-body max-w-7xl mx-auto overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col items-center text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black font-headline text-on-surface tracking-tighter leading-none">Clinician Synchronization</h1>
        <p className="text-on-surface-variant/60 text-sm font-black uppercase tracking-[0.1em]">Internal Clinical Network Request Protocol v2.4</p>
      </div>

      {/* Progress Architecture */}
      <div className="max-w-4xl mx-auto mb-20 relative px-4">
        <div className="absolute top-6 left-0 right-0 h-[3px] bg-surface-container-high rounded-full z-0"></div>
        <div 
          className="absolute top-6 left-0 h-[3px] bg-primary transition-all duration-1000 ease-in-out z-0 rounded-full shadow-[0_0_15px_rgba(25, 118, 210, 0.5)]" 
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        ></div>
        
        <div className="relative z-10 flex justify-between">
          {[1, 2, 3].map(num => (
            <div key={num} className="flex flex-col items-center group">
              <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center font-black text-sm transition-all duration-500 border-4 ${
                step >= num 
                  ? 'bg-primary text-white border-surface shadow-2xl shadow-primary/40 scale-110' 
                  : 'bg-surface-container-high text-on-surface-variant/40 border-surface'
              }`}>
                {step > num ? (
                   <span className="material-symbols-outlined font-black">check</span>
                ) : num}
              </div>
              <span className={`text-[10px] mt-4 font-black uppercase tracking-[0.25em] transition-colors duration-500 ${
                step >= num ? 'text-primary' : 'text-on-surface-variant/20'
              }`}>
                {num === 1 ? 'Expertise' : num === 2 ? 'Temporal' : 'Validation'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interface Modules */}
      <div className="max-w-4xl mx-auto space-y-24">
        
        {/* STEP MODULES */}
        {step === 1 && (
          <div className="animate-fade-in space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="bg-surface-container-lowest p-10 rounded-[3rem] border border-outline-variant/10 shadow-sm space-y-8">
                  <h4 className="font-headline font-black text-sm uppercase tracking-[0.2em] text-on-surface-variant/60 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                    Clinical Domain
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {departments.map((dept, idx) => (
                      <button
                         key={idx}
                         onClick={() => setFormData(prev => ({ ...prev, department: dept, doctor_id: '' }))}
                         className={`w-full p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                           formData.department === dept 
                             ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[0.98]' 
                             : 'bg-surface-container-low border-transparent hover:border-primary/20 text-on-surface'
                         }`}
                      >
                         <div className="relative z-10">
                           <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${formData.department === dept ? 'text-white/60' : 'text-primary'}`}>Module {idx+1}</p>
                           <h5 className="font-black text-lg tracking-tight uppercase">{dept}</h5>
                         </div>
                         <div className={`absolute right-[-20px] bottom-[-20px] opacity-10 transition-transform duration-700 group-hover:scale-150 ${formData.department === dept ? 'text-white' : 'text-primary'}`}>
                            <span className="material-symbols-outlined text-8xl">clinical_notes</span>
                         </div>
                      </button>
                    ))}
                  </div>
               </div>
               <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-black/5 space-y-8 min-h-[500px]">
                  <h4 className="font-headline font-black text-sm uppercase tracking-[0.2em] text-on-surface-variant/60 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
                    Expertise Registry
                  </h4>
                  <div className="space-y-6">
                    {filteredDoctors.map(doc => (
                      <button
                         key={doc.id}
                         onClick={() => setFormData(prev => ({ ...prev, doctor_id: doc.id }))}
                         className={`w-full p-6 rounded-[2.5rem] border transition-all text-left flex items-center gap-6 ${
                           formData.doctor_id === doc.id 
                             ? 'bg-primary/5 border-primary ring-4 ring-primary/5' 
                             : 'bg-transparent border-outline-variant/10 hover:border-primary/30'
                         }`}
                      >
                         <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-surface shadow-inner">
                            <img src={doc.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAU0mH6_eZ92pD3S7930N7w_c9G338G8p2P1PZoy_0w3YJ_z8_a"} alt="Expert" className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1">
                            <h5 className="font-black text-on-surface text-lg tracking-tight leading-none mb-1">
                              Dr. {doc.first_name} {doc.last_name}
                            </h5>
                            <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Expertise: {doc.experience_years || '5+'} Years</p>
                         </div>
                         <div className="text-right">
                            <span className="block text-sm font-black text-primary">${doc.consultation_fee}</span>
                            <span className="text-[9px] font-black text-on-surface-variant/30 uppercase tracking-tighter">FEE</span>
                         </div>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-surface-container-lowest p-10 rounded-[4rem] border border-outline-variant/10 shadow-sm space-y-10">
                   <h4 className="font-headline font-black text-sm uppercase tracking-[0.2em] text-on-surface-variant/60 flex items-center gap-3">
                     <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                     Target Date
                   </h4>
                   <div className="relative group/field">
                      <input 
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.appointment_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, appointment_date: e.target.value }))}
                        className="w-full bg-surface-container-low border-none rounded-[2rem] h-20 px-10 text-lg font-black text-on-surface focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer"
                      />
                      <div className="mt-8 p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10">
                         <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest leading-loose">The selected temporal window will be reserved upon confirmation. Same-day cancellations require identity verification.</p>
                      </div>
                   </div>
                </div>
                <div className="bg-white p-10 rounded-[4rem] shadow-2xl shadow-black/5 space-y-10">
                   <h4 className="font-headline font-black text-sm uppercase tracking-[0.2em] text-on-surface-variant/60 flex items-center gap-3">
                     <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                     Available Windows
                   </h4>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                     {timeSlots.map(time => (
                       <button
                         key={time}
                         onClick={() => setFormData(prev => ({ ...prev, time_slot: time }))}
                         className={`py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                           formData.time_slot === time 
                             ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-95' 
                             : 'bg-surface-container-low text-on-surface-variant/60 hover:bg-primary/5 hover:text-primary'
                         }`}
                       >
                         {time}
                       </button>
                     ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in space-y-12">
             <div className="bg-on-surface p-12 rounded-[5rem] relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transition-transform duration-[3s] group-hover:scale-110">
                  <span className="material-symbols-outlined text-[300px] text-white font-light">verified_user</span>
               </div>
               <div className="relative z-10 space-y-12">
                  <h4 className="font-headline font-black text-xl uppercase tracking-[0.3em] text-white/40 flex items-center gap-4">
                    <span className="w-12 h-[2px] bg-white/20"></span>
                    Identity Triage Summary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-10">
                       <div className="flex items-center gap-8">
                          <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden border-4 border-white/10 ring-8 ring-white/5">
                             <img src={selectedDoctorInfo?.image_url} alt="Clinician" className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Chief Clinician</p>
                             <h5 className="font-black text-white text-3xl tracking-tighter">
                               Dr. {selectedDoctorInfo?.first_name} {selectedDoctorInfo?.last_name}
                             </h5>
                             <span className="px-3 py-1 bg-primary/20 border border-primary/40 rounded-full text-[9px] font-black text-primary uppercase tracking-widest mt-2 inline-block">{selectedDoctorInfo?.department}</span>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-8">
                          <div>
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Synchrony Window</p>
                             <p className="text-white font-black text-lg">{new Date(formData.appointment_date).toLocaleDateString()}</p>
                             <p className="text-primary font-black text-sm uppercase tracking-widest">{formData.time_slot}</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Resource Fee</p>
                             <p className="text-white font-black text-3xl">${selectedDoctorInfo?.consultation_fee}</p>
                             <p className="text-primary font-black text-[9px] uppercase tracking-widest">Clinic Settlement</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Symptomatic Description</label>
                      <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 ring-4 ring-white/0 focus-within:ring-white/5 transition-all">
                         <textarea 
                           className="w-full bg-transparent border-none p-0 focus:ring-0 text-lg font-black text-white placeholder-white/10 resize-none min-h-[160px]"
                           value={formData.reason}
                           onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                           placeholder="Identify primary symptomatic vectors..."
                         ></textarea>
                      </div>
                    </div>
                  </div>
               </div>
             </div>
          </div>
        )}

        {/* UPCOMING APPOINTMENT PANELS SECTION */}
        <div className="space-y-10 py-10 border-t border-outline-variant/10">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black font-headline text-on-surface">Synchronized Schedule</h3>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest px-4 py-2 bg-primary/5 rounded-full">{appointments.length} Active Slots</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {appointments.length === 0 ? (
                <div className="col-span-full py-16 px-10 bg-surface-container-lowest rounded-[3rem] text-center border-2 border-dashed border-outline-variant/20">
                   <span className="material-symbols-outlined text-6xl text-outline-variant/40 mb-4">event_busy</span>
                   <p className="text-on-surface-variant font-black uppercase tracking-widest text-[11px]">No active clinical records found in schedule.</p>
                </div>
              ) : (
                appointments.map(apt => (
                  <div key={apt.id} className="group bg-white p-8 rounded-[3rem] shadow-xl shadow-black/[0.02] hover:shadow-2xl hover:shadow-black/5 transition-all border border-outline-variant/5">
                     <div className="flex items-center gap-6 mb-8">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-surface shadow-inner bg-surface-container-high">
                           <img src={apt.doctors?.image_url} alt="Expert" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                           <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{apt.department}</p>
                           <h5 className="font-black text-on-surface text-lg leading-none">
                             Dr. {apt.doctors?.first_name} {apt.doctors?.last_name}
                           </h5>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-container-low p-5 rounded-2xl">
                           <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-tighter mb-1">Target Date</p>
                           <p className="text-[11px] font-black text-on-surface uppercase tracking-widest">{new Date(apt.appointment_date).toLocaleDateString('en-GB')}</p>
                        </div>
                        <div className="bg-surface-container-low p-5 rounded-2xl">
                           <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-tighter mb-1">Temporal Window</p>
                           <p className="text-[11px] font-black text-on-surface uppercase tracking-widest">{apt.appointment_time}</p>
                        </div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* Global Footer Navigation */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 z-50 bg-white/80 backdrop-blur-3xl px-8 py-8 border-t border-outline-variant/10 flex justify-between items-center max-w-4xl mx-auto rounded-t-[3rem] md:rounded-t-none md:max-w-none">
          <button
            onClick={handleBack}
            disabled={step === 1 || loading}
            className={`px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-on-surface transition-all ${
              step === 1 ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            Revert Step
          </button>
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={step === 1 ? (!formData.department || !formData.doctor_id) : (!formData.appointment_date || !formData.time_slot)}
              className="px-16 py-6 bg-primary text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 hover:scale-95 disabled:opacity-20 transition-all flex items-center gap-4"
            >
              Analyze & Continue
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.reason}
              className="px-16 py-6 bg-primary text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 hover:scale-95 disabled:opacity-20 transition-all flex items-center gap-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">verified</span>
                  Commit Triage Request
                </>
              )}
            </button>
          )}
        </div>

      </div>

      {/* Decorative Ambience */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[50%] h-[50%] bg-secondary-container/20 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}
