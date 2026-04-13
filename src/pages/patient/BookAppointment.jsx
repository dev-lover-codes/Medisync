import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BookAppointment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingDocs, setFetchingDocs] = useState(true);
  
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  
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
  }, []);

  const fetchInitialData = async () => {
    try {
      setFetchingDocs(true);
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('available_today', true);

      if (error) throw error;
      
      const docs = data || [];
      setDoctors(docs);
      
      // Extract unique departments
      const depts = [...new Set(docs.map(d => d.department))];
      setDepartments(depts);
      
      if (depts.length > 0) {
        setFormData(prev => ({ ...prev, department: depts[0] }));
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setFetchingDocs(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && (!formData.department || !formData.doctor_id)) {
      alert("Please select a department and a doctor.");
      return;
    }
    if (step === 2 && (!formData.appointment_date || !formData.time_slot)) {
      alert("Please select a date and time slot.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!formData.reason) {
      alert("Please provide a reason for the visit.");
      return;
    }
    
    try {
      setLoading(true);
      
      // Get doctor fee
      const selectedDoc = doctors.find(d => d.id === formData.doctor_id);
      const fee = selectedDoc ? selectedDoc.consultation_fee : 0;
      
      const { error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: user.id,
          doctor_id: formData.doctor_id,
          department: formData.department,
          appointment_date: formData.appointment_date,
          time_slot: formData.time_slot,
          reason: formData.reason,
          consultation_fee: fee,
          status: 'upcoming'
        }]);

      if (error) throw error;
      
      // Normally redirect to a success page, but we'll redirect to appointments for now
      navigate('/patient/appointments');
      
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get doctors specific to selected department
  const filteredDoctors = doctors.filter(d => d.department === formData.department);
  const selectedDoctorInfo = doctors.find(d => d.id === formData.doctor_id);

  if (fetchingDocs) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6f5673]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-24 bg-[#faf9fa] min-h-screen flex justify-center items-start">
      <div className="max-w-3xl w-full">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-manrope text-gray-800 mb-2">Book Appointment</h1>
          <p className="text-gray-500 font-inter">Schedule your visit in three easy steps</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-[#bc9ebf] transition-all duration-300 -translate-y-1/2 z-0 rounded-full" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          
          <div className="relative z-10 flex justify-between">
            {[1, 2, 3].map(num => (
              <div key={num} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-4 border-[#faf9fa]
                  ${step > num ? 'bg-[#6f5673] text-white' : 
                    step === num ? 'bg-[#bc9ebf] text-white border-white shadow-lg' : 
                    'bg-white border-gray-200 text-gray-400'}`}>
                  {num}
                </div>
                <span className={`text-xs mt-2 font-inter font-medium ${step >= num ? 'text-[#6f5673]' : 'text-gray-400'}`}>
                  {num === 1 ? 'Doctor' : num === 2 ? 'Time' : 'Details'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-50 p-6 md:p-10 mb-8 min-h-[400px]">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold font-manrope text-gray-800 mb-6 border-b border-gray-100 pb-2">Select Speciality & Doctor</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Department</label>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 p-4 border-r border-gray-200 flex items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <select 
                    value={formData.department}
                    onChange={(e) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        department: e.target.value, 
                        doctor_id: '' // reset doctor selection
                      }));
                    }}
                    className="w-full p-4 bg-transparent focus:outline-none font-inter text-gray-800"
                  >
                    {departments.length === 0 && <option value="">No departments available</option>}
                    {departments.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.department && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Available Doctors</label>
                  <div className="grid gap-3">
                    {filteredDoctors.length === 0 && (
                      <div className="p-4 bg-gray-50 rounded-lg text-gray-500 font-inter text-center text-sm border border-gray-100">
                        No doctors currently available in this department.
                      </div>
                    )}
                    {filteredDoctors.map(doc => (
                      <label 
                        key={doc.id}
                        className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.doctor_id === doc.id ? 'border-[#6f5673] bg-[#bc9ebf]/10 shadow-[0_4px_12px_rgba(111,86,115,0.1)]' : 'border-gray-200 hover:border-[#bc9ebf]/50 bg-white'}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${formData.doctor_id === doc.id ? 'border-[#6f5673]' : 'border-gray-300'}`}>
                          {formData.doctor_id === doc.id && <div className="w-2.5 h-2.5 bg-[#6f5673] rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 font-manrope">Dr. {doc.full_name}</h4>
                          <p className="text-sm text-gray-500 font-inter">{doc.specialization} • {doc.experience_years} Years Exp.</p>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-[#6f5673] font-inter">${doc.consultation_fee}</span>
                          <span className="text-xs text-gray-400">Consultation Fee</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold font-manrope text-gray-800 mb-6 border-b border-gray-100 pb-2">Select Date & Time</h2>
              
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Preferred Date</label>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 p-4 border-r border-gray-200 flex items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.appointment_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, appointment_date: e.target.value }))}
                    className="w-full p-4 bg-transparent focus:outline-none font-inter text-gray-800"
                  />
                </div>
              </div>

              {formData.appointment_date && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 font-inter">Available Time Slots</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setFormData(prev => ({ ...prev, time_slot: time }))}
                        className={`py-3 rounded-lg text-sm font-semibold font-inter transition-all ${formData.time_slot === time ? 'bg-[#6f5673] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold font-manrope text-gray-800 mb-6 border-b border-gray-100 pb-2">Final Details</h2>
              
              <div className="bg-[#bc9ebf]/10 rounded-xl p-5 mb-8 border border-[#e9d7f1]">
                <h3 className="font-bold text-[#6f5673] font-manrope mb-3 text-lg">Appointment Summary</h3>
                <div className="grid grid-cols-2 gap-y-3 font-inter text-sm">
                  <div className="text-gray-500">Doctor:</div>
                  <div className="font-semibold text-gray-800">Dr. {selectedDoctorInfo?.full_name} ({selectedDoctorInfo?.department})</div>
                  
                  <div className="text-gray-500">Date & Time:</div>
                  <div className="font-semibold text-gray-800">{new Date(formData.appointment_date).toLocaleDateString()} at {formData.time_slot}</div>
                  
                  <div className="text-gray-500">Consultation Fee:</div>
                  <div className="font-semibold text-gray-800">${selectedDoctorInfo?.consultation_fee} (Payable at clinic)</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Reason for Visit</label>
                <textarea 
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  rows={4}
                  placeholder="Please describe your symptoms or reason for consultation..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bc9ebf] transition-all resize-none font-inter text-gray-800"
                ></textarea>
                <p className="text-xs text-gray-400 mt-2 font-inter">Your information is secure and will only be shared with your assigned doctor.</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1 || loading}
            className={`px-8 py-3 rounded-full font-inter font-medium transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'border border-gray-300 text-gray-600 hover:bg-gray-50 bg-white shadow-sm'}`}
          >
            Back
          </button>
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="bg-[#6f5673] text-white px-8 py-3 rounded-full font-inter font-medium hover:bg-[#bc9ebf] transition-colors shadow-lg shadow-[#6f5673]/20"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#6f5673] text-white px-8 py-3 rounded-full font-inter font-medium hover:bg-[#bc9ebf] transition-colors shadow-lg shadow-[#6f5673]/20 flex items-center min-w-[140px] justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                "Confirm Booking"
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
