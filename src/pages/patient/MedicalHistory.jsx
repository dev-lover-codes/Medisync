import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function MedicalHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMedicalHistory();
    }
  }, [user]);

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('medical_history')
        .select(`
          *,
          doctors (
            full_name
          )
        `)
        .eq('patient_id', user.id)
        .order('visit_date', { ascending: false });

      if (fetchError) throw fetchError;
      setHistory(data || []);
    } catch (err) {
      console.error("Error fetching medical history:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'OPD': return 'bg-blue-100 text-blue-800';
      case 'Emergency': return 'bg-red-100 text-red-800';
      case 'Surgery': return 'bg-purple-100 text-purple-800';
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-manrope text-gray-800 mb-2">Medical History</h1>
        <p className="text-gray-500 font-inter">Your complete health timeline and past visits</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 font-inter">
          {error}
        </div>
      )}

      {history.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-[#e9d7f1] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#6f5673]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold font-manrope text-gray-800 mb-2">No Records Yet</h3>
          <p className="text-gray-500 font-inter mb-6">You don't have any past medical history recorded.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-[#e9d7f1] ml-4 md:ml-6 pl-6 md:pl-10 space-y-8">
          {history.map((record) => (
            <div key={record.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-[35px] md:-left-[51px] top-6 w-4 h-4 bg-[#6f5673] rounded-full border-4 border-[#faf9fa] box-content"></div>
              
              <div className="bg-white rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-50 p-6 transition-transform hover:-translate-y-1 duration-300">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getTypeColor(record.visit_type)}`}>
                        {record.visit_type}
                      </span>
                      <span className="text-gray-400 font-inter text-sm">
                        {new Date(record.visit_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-manrope text-gray-800">
                      {record.department} Consultation
                    </h3>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-semibold text-gray-800 font-inter text-sm">Attending Doctor</p>
                    <p className="text-[#6f5673] text-sm font-inter">Dr. {record.doctors?.full_name || 'Unknown'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {record.diagnosis && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Diagnosis</p>
                      <p className="text-gray-800 font-inter text-sm">{record.diagnosis}</p>
                    </div>
                  )}

                  {record.tests_done && record.tests_done.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tests Conducted</p>
                      <div className="flex flex-wrap gap-2">
                        {record.tests_done.map((test, idx) => (
                          <span key={idx} className="bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {record.notes && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Notes Details</p>
                    <p className="text-gray-600 font-inter text-sm leading-relaxed">{record.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
