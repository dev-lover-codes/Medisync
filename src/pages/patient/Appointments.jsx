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

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch appointments and join with doctors to get doctor details if possible
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          doctors (
            full_name,
            specialization
          )
        `)
        .eq('patient_id', user.id)
        .order('appointment_date', { ascending: true });

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
      
      // Update local state instead of refetching for better UX
      setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status: 'cancelled' } : app
      ));
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-[#e9d7f1] text-[#6f5673]';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6f5673]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-24 bg-[#faf9fa] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-manrope text-gray-800 mb-2">My Appointments</h1>
          <p className="text-gray-500 font-inter">Manage your upcoming and past appointments</p>
        </div>
        <button 
          onClick={() => navigate('/patient/book-appointment')}
          className="bg-[#6f5673] text-white px-6 py-3 rounded-full font-inter font-medium hover:bg-[#bc9ebf] transition-colors flex items-center gap-2 shadow-lg shadow-[#6f5673]/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Book New
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 font-inter">
          {error}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-[#e9d7f1] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#6f5673]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold font-manrope text-gray-800 mb-2">No Appointments Yet</h3>
          <p className="text-gray-500 font-inter mb-6">You haven't booked any appointments. Ready to schedule your first visit?</p>
          <button 
            onClick={() => navigate('/patient/book-appointment')}
            className="bg-[#6f5673] text-white px-8 py-3 rounded-full font-inter hover:bg-[#bc9ebf] transition-colors"
          >
            Book Appointment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-50 transition-transform hover:-translate-y-1 duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(apt.status)}`}>
                  {apt.status}
                </span>
                <span className="text-gray-400 font-inter text-sm">
                  {apt.department}
                </span>
              </div>
              
              <h3 className="text-lg font-bold font-manrope text-gray-800 mb-1">
                Dr. {apt.doctors?.full_name || 'Unassigned'}
              </h3>
              <p className="text-[#6f5673] font-medium font-inter text-sm mb-4">
                {apt.doctors?.specialization || 'General Consultation'}
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-600 font-inter text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(apt.appointment_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center text-gray-600 font-inter text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {apt.time_slot}
                </div>
                {apt.reason && (
                  <div className="flex items-start text-gray-600 font-inter text-sm mt-3 pt-3 border-t border-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="line-clamp-2">{apt.reason}</span>
                  </div>
                )}
              </div>
              
              {apt.status === 'upcoming' && (
                <button 
                  onClick={() => {
                    if(window.confirm('Are you sure you want to cancel this appointment?')) {
                      cancelAppointment(apt.id);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 font-inter font-medium hover:bg-red-50 transition-colors"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
