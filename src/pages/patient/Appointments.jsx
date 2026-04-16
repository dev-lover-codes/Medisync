import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Appointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user, activeTab]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('appointments')
        .select(`
          *,
          doctors (
            full_name,
            specialization,
            image_url
          )
        `)
        .eq('patient_id', user.id);

      if (activeTab === 'upcoming') {
        query = query.eq('status', 'upcoming').order('appointment_date', { ascending: true });
      } else if (activeTab === 'past') {
        query = query.eq('status', 'completed').order('appointment_date', { ascending: false });
      } else if (activeTab === 'cancelled') {
        query = query.eq('status', 'cancelled').order('appointment_date', { ascending: false });
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setAppointments(data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;
      
      setAppointments(prev => prev.filter(app => app.id !== id));
      alert("Appointment cancelled successfully.");
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'upcoming': return { color: 'bg-green-50 text-green-700 border-green-100', dot: 'bg-green-500', label: 'Confirmed' };
      case 'completed': return { color: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500', label: 'Completed' };
      case 'cancelled': return { color: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-500', label: 'Cancelled' };
      default: return { color: 'bg-gray-50 text-gray-700 border-gray-100', dot: 'bg-gray-500', label: status };
    }
  };

  return (
    <div className="p-4 md:p-8 pb-24 bg-surface min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight leading-none mb-3">Health Schedule</h1>
          <p className="text-on-surface-variant font-medium">Manage and track your healthcare journey at MediSync</p>
        </div>
        <button 
          onClick={() => navigate('/patient/book-appointment')}
          className="bg-gradient-to-r from-primary to-primary-container text-white px-8 py-4 rounded-3xl font-bold shadow-xl shadow-primary/20 flex items-center gap-2 active:scale-95 transition-all hover:opacity-90 group"
        >
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
          Book New Appointment
        </button>
      </div>

      {/* Tabs Section */}
      <div className="flex items-center gap-8 mb-10 border-b border-surface-container-high overflow-x-auto no-scrollbar">
        {['upcoming', 'past', 'cancelled'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 border-b-4 font-black flex items-center gap-2 transition-all whitespace-nowrap px-2 uppercase tracking-widest text-xs ${
              activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="bg-primary-container text-on-primary-container text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">
                {appointments.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error px-6 py-4 rounded-2xl mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <p className="font-bold">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 bg-surface-container-lowest rounded-[3rem] border-2 border-dashed border-outline-variant/10">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-on-surface-variant font-black uppercase tracking-widest text-xs">Retrieving Data...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-[3rem] p-16 text-center border-2 border-dashed border-outline-variant/20 shadow-sm">
          <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">event_busy</span>
          </div>
          <h3 className="text-2xl font-black text-on-surface mb-3 uppercase tracking-tight">No {activeTab} Records found</h3>
          <p className="text-on-surface-variant font-medium mb-8 max-w-sm mx-auto">Your healthcare timeline is currently clear in this section. Would you like to schedule a professional consultation?</p>
          <button 
            onClick={() => navigate('/patient/book-appointment')}
            className="bg-primary/5 text-primary px-8 py-3 rounded-full font-black hover:bg-primary hover:text-white transition-all border-2 border-primary/10 uppercase tracking-widest text-xs"
          >
            Start Fresh Consultation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          {appointments.map((apt) => {
            const status = getStatusDisplay(apt.status);
            return (
              <div 
                key={apt.id} 
                className="bg-surface-container-lowest rounded-[2rem] p-6 !pb-8 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-xl transition-all border border-outline-variant/5 group relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-2 h-full ${apt.status === 'upcoming' ? 'bg-primary' : 'bg-outline-variant'}`}></div>

                {/* Doctor Profile Info */}
                <div className="flex items-center gap-5 flex-1 w-full">
                  <div className="relative shrink-0">
                    <img 
                      className="w-20 h-20 rounded-[1.5rem] object-cover shadow-lg border-2 border-white" 
                      src={apt.doctors?.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuClef_wlPZAhy5lua2Vq5Bmaoj5U3kPFh_d_HPCR7YJESvMwH09GyDhvvVERy1qaDRy2oGwNaL2VOafKQy3viee2XE5Bm7EazgEVC35LGn7gluKrlbiD9ufrOGOhNcYuTJux6jiCNstqd63ktjl4swNP6WthtW1SOBQ0iMgrU_-mCYLM-h3YW6mWC_2V1VutwdVqhfIcOmRfF3nYpeN7l7zpP2ALJ_Q0gHZmbi383D0xxjyXJGAadX1wOrxqr-qdOoaBMXAVP8jvxw"} 
                      alt={apt.doctors?.full_name}
                    />
                    <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-md">
                      <div className={`w-3 h-3 rounded-full ${status.dot} animate-pulse`}></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-on-surface leading-tight">Dr. {apt.doctors?.full_name || 'Medical Specialist'}</h3>
                    <p className="text-primary font-black uppercase tracking-widest text-[10px] my-1">{apt.department || apt.doctors?.specialization || 'General Consultation'}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border shadow-sm ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vertical Divider (Desktop) */}
                <div className="hidden md:block w-px h-24 bg-outline-variant/10"></div>

                {/* Schedule Details */}
                <div className="flex-1 w-full">
                  <div className="bg-surface-container-low/50 rounded-2xl p-4 border border-outline-variant/5">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                       <p className="font-black text-on-surface text-sm uppercase tracking-tighter">
                         {new Date(apt.appointment_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                       </p>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                       <p className="text-2xl font-black text-on-surface font-headline leading-none">
                         {apt.time_slot}
                       </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-3 shrink-0 w-full md:w-auto">
                  {apt.status === 'upcoming' && (
                    <>
                      <button className="flex-1 p-3 bg-primary text-white rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-primary/10">
                         <span className="material-symbols-outlined">edit_calendar</span>
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Delete this scheduled visit?')) cancelAppointment(apt.id);
                        }}
                        className="flex-1 p-3 bg-red-50 text-error rounded-2xl hover:bg-error hover:text-white transition-all border border-error/10"
                      >
                         <span className="material-symbols-outlined">close</span>
                      </button>
                    </>
                  )}
                  {apt.status === 'completed' && (
                    <button 
                      onClick={() => setSelectedAppointment(apt)}
                      className="p-3 bg-primary/5 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all border border-primary/10 flex items-center gap-2 px-5 font-black uppercase tracking-widest text-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">lab_profile</span>
                      Summary
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Appointment Summary Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 scale-100 p-1">
            <div className="bg-surface-container-low rounded-[2.3rem] overflow-hidden">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-3xl">medical_information</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-2xl text-on-surface">Medical Record</h4>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Appointment ID: #{selectedAppointment.id.slice(0, 8)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-on-surface hover:bg-red-50 hover:text-error transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
                <div className="bg-white p-6 rounded-3xl border border-outline-variant/10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                  <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">stethoscope</span>
                    Clinical Observation
                  </h5>
                  <p className="text-on-surface font-extrabold text-lg mb-2">Subjective Assessment</p>
                  <p className="text-on-surface-variant text-sm leading-relaxed font-medium">
                    {selectedAppointment.reason || "General routine checkup and wellness evaluation session."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white p-5 rounded-3xl border border-outline-variant/10">
                     <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Technician</p>
                     <p className="font-extrabold text-on-surface">Dr. {selectedAppointment.doctors?.full_name}</p>
                   </div>
                   <div className="bg-white p-5 rounded-3xl border border-outline-variant/10">
                     <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Department</p>
                     <p className="font-extrabold text-on-surface uppercase text-xs tracking-tight">{selectedAppointment.department || 'Clinical Excellence'}</p>
                   </div>
                </div>
              </div>

              <div className="p-8 pt-0 flex gap-4">
                <button className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Clinical Report
                </button>
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 py-4 bg-white text-on-surface rounded-2xl font-black uppercase tracking-widest text-xs border border-outline-variant/10 hover:bg-surface-container-low transition-all"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

