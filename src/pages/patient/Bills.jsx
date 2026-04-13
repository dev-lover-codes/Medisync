import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function Bills() {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchBills();
    }
  }, [user]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('bills')
        .select(`
          *,
          appointments (
            appointment_date,
            department,
            doctors (
              full_name
            )
          )
        `)
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setBills(data || []);
    } catch (err) {
      console.error("Error fetching bills:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayBill = async (id) => {
    try {
      setPayingId(id);
      
      // Simulate payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { error } = await supabase
        .from('bills')
        .update({ 
          status: 'paid', 
          payment_method: 'Credit Card', // default dummy method
          paid_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setBills(prev => prev.map(bill => 
        bill.id === id ? { 
          ...bill, 
          status: 'paid', 
          payment_method: 'Credit Card',
          paid_at: new Date().toISOString()
        } : bill
      ));
      
      alert("Payment successful! Thank you.");
    } catch (err) {
      console.error("Error paying bill:", err);
      alert("Failed to process payment. Please try again.");
    } finally {
      setPayingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-manrope text-gray-800 mb-2">My Bills</h1>
          <p className="text-gray-500 font-inter">Manage your medical invoices and payments</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500 font-inter mb-1">Total Outstanding</p>
          <p className="text-2xl font-bold text-red-500 font-manrope">
            ${bills.filter(b => b.status === 'pending' || b.status === 'overdue').reduce((acc, curr) => acc + Number(curr.total_amount), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 font-inter">
          {error}
        </div>
      )}

      {bills.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-[#e9d7f1] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#6f5673]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold font-manrope text-gray-800 mb-2">No Bills Found</h3>
          <p className="text-gray-500 font-inter">You don't have any billing history at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bills.map((bill) => (
            <div key={bill.id} className="bg-white rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-50 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-50 flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold font-manrope text-gray-800">
                      Invoice #{bill.id.split('-')[0].toUpperCase()}
                    </h3>
                    <p className="text-gray-400 font-inter text-sm">
                      Date: {new Date(bill.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(bill.status)}`}>
                    {bill.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  {bill.appointments && (
                    <p className="text-sm font-medium text-gray-700 font-inter text-center mb-3 pb-3 border-b border-gray-200">
                      Visit on {new Date(bill.appointments.appointment_date).toLocaleDateString()} • {bill.appointments.department} ({'Dr. ' + (bill.appointments.doctors?.full_name || 'Unknown')})
                    </p>
                  )}
                  
                  <div className="space-y-2 font-inter text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Consultation Fee</span>
                      <span>${Number(bill.consultation_fee).toFixed(2)}</span>
                    </div>
                    {Number(bill.medicine_charges) > 0 && (
                      <div className="flex justify-between">
                        <span>Medicine Charges</span>
                        <span>${Number(bill.medicine_charges).toFixed(2)}</span>
                      </div>
                    )}
                    {Number(bill.lab_charges) > 0 && (
                      <div className="flex justify-between">
                        <span>Laboratory Charges</span>
                        <span>${Number(bill.lab_charges).toFixed(2)}</span>
                      </div>
                    )}
                    {Number(bill.bed_charges) > 0 && (
                      <div className="flex justify-between">
                        <span>Bed/Room Charges</span>
                        <span>${Number(bill.bed_charges).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-end mt-auto">
                  <div className="text-gray-500 font-inter text-sm">
                    {bill.status === 'paid' && bill.paid_at && (
                      <>Paid on {new Date(bill.paid_at).toLocaleDateString()}</>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Total</p>
                    <p className="text-2xl font-bold font-manrope text-gray-800">
                      ${Number(bill.total_amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {(bill.status === 'pending' || bill.status === 'overdue') && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => handlePayBill(bill.id)}
                    disabled={payingId === bill.id}
                    className="bg-[#6f5673] text-white px-8 py-2.5 rounded-xl font-inter font-medium hover:bg-[#bc9ebf] transition-colors shadow-md shadow-[#6f5673]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                  >
                    {payingId === bill.id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
