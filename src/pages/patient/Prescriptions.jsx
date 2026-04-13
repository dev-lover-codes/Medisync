import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function Prescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('prescriptions')
        .select(`
          *,
          doctors (
            full_name,
            specialization
          ),
          prescription_items (*)
        `)
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPrescriptions(data || []);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const requestRefill = (id) => {
    // In a real app, this would create an alert/notification/message for the doctor
    alert("Refill request sent to the doctor successfully!");
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
        <h1 className="text-3xl font-bold font-manrope text-gray-800 mb-2">My Prescriptions</h1>
        <p className="text-gray-500 font-inter">View your digital prescriptions and request refills</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 font-inter">
          {error}
        </div>
      )}

      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-[#e9d7f1] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#6f5673]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold font-manrope text-gray-800 mb-2">No Prescriptions Found</h3>
          <p className="text-gray-500 font-inter">You don't have any prescriptions on record yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {prescriptions.map((px) => {
            const isExpired = new Date(px.valid_until) < new Date();
            
            return (
              <div key={px.id} className="bg-white rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-50 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold font-manrope text-gray-800">
                      Prescribed by Dr. {px.doctors?.full_name || 'Unknown'}
                    </h3>
                    <p className="text-[#6f5673] font-inter text-sm">
                      {px.doctors?.specialization || 'Consultation'} • {new Date(px.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {isExpired ? 'Expired' : 'Valid until ' + new Date(px.valid_until).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => requestRefill(px.id)}
                      className="bg-[#6f5673] text-white px-4 py-2 rounded-lg font-inter text-sm hover:bg-[#bc9ebf] transition-colors"
                    >
                      Request Refill
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  {px.diagnosis && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold font-manrope text-gray-800 mb-1">Diagnosis</h4>
                      <p className="text-gray-600 font-inter text-sm">{px.diagnosis}</p>
                    </div>
                  )}

                  <h4 className="text-sm font-semibold font-manrope text-gray-800 mb-3 block">Medications</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500 font-inter text-xs uppercase tracking-wider">
                          <th className="py-2 pr-4 font-semibold">Medicine</th>
                          <th className="py-2 pr-4 font-semibold">Dosage</th>
                          <th className="py-2 pr-4 font-semibold">Frequency</th>
                          <th className="py-2 pr-4 font-semibold">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-800 font-inter text-sm divide-y divide-gray-50">
                        {px.prescription_items?.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50">
                            <td className="py-3 pr-4 font-medium">{item.medicine_name}</td>
                            <td className="py-3 pr-4 text-gray-600">{item.dosage}</td>
                            <td className="py-3 pr-4 text-gray-600">{item.frequency}</td>
                            <td className="py-3 pr-4 text-gray-600">{item.duration}</td>
                          </tr>
                        ))}
                        {(!px.prescription_items || px.prescription_items.length === 0) && (
                          <tr>
                            <td colSpan="4" className="py-3 text-gray-500 italic text-center">No medicines recorded</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {px.notes && (
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-yellow-800 font-inter text-sm border border-yellow-100">
                      <span className="font-semibold block mb-1">Doctor's Notes:</span>
                      {px.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
