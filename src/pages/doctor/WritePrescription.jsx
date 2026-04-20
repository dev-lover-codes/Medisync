import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import logger from '../../utils/logger';

/**
 * WritePrescription Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function WritePrescription() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const patientIdParam = searchParams.get('patient');
  const appointmentIdParam = searchParams.get('appointment');

  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '' }
  ]);

  useEffect(() => {
    if (patientIdParam) {
      fetchPatientDetails();
    }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientIdParam]);

  const fetchPatientDetails = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', patientIdParam)
      .single();
    if (data) setPatient(data);
  };

  /**
 * addMedication internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  /**
 * removeMedication internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const removeMedication = (index) => {
    const list = [...medications];
    list.splice(index, 1);
    setMedications(list);
  };

  /**
 * handleMedChange internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const handleMedChange = (index, field, value) => {
    const list = [...medications];
    list[index][field] = value;
    setMedications(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientIdParam) return alert('No patient selected');
    
    setLoading(true);
    try {
      // 1. Create Prescription record
      const { data: prescription, error: presError } = await supabase
        .from('prescriptions')
        .insert({
          patient_id: patientIdParam,
          doctor_id: user.id,
          appointment_id: appointmentIdParam || null,
          diagnosis: diagnosis,
          notes: instructions,
          issued_date: new Date().toISOString()
        })
        .select()
        .single();

      if (presError) throw presError;

      // 2. Insert items
      const itemsToInsert = medications.filter(m => m.name).map(m => ({
        prescription_id: prescription.id,
        medication_name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration
      }));

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from('prescription_items')
          .insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      // 3. Update appointment status to 'completed'
      if (appointmentIdParam) {
        await supabase
          .from('appointments')
          .update({ status: 'completed' })
          .eq('id', appointmentIdParam);
      }

      alert('Prescription issued successfully!');
      navigate('/doctor/dashboard');

    } catch (err) {
      logger.error('Error issuing prescription:', err);
      alert('Failed to issue prescription: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-3xl font-extrabold font-headline">New Prescription</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Patient Summary Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-4xl">person</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Prescribing for</p>
              <h2 className="text-2xl font-extrabold font-headline">{patient?.full_name || 'Loading Patient...'}</h2>
              <p className="text-primary font-bold text-sm">Patient ID: {patient?.id?.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-container-low px-4 py-2 rounded-xl text-center">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">Age / Gender</p>
              <p className="font-bold">28 / {patient?.gender || 'M'}</p>
            </div>
            <div className="bg-surface-container-low px-4 py-2 rounded-xl text-center">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">Blood Type</p>
              <p className="font-bold text-primary">{patient?.blood_group || 'O+'}</p>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 space-y-4">
          <h3 className="font-headline font-extrabold text-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">clinical_notes</span>
            Diagnosis & Clinical Notes
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">Final Diagnosis</label>
              <input 
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Viral Pharyngitis"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">Instructions / Notes</label>
              <textarea 
                rows="3"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="General lifestyle advice, special precautions, etc."
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-extrabold text-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">medication</span>
              Medications
            </h3>
            <button 
              type="button" 
              onClick={addMedication}
              className="flex items-center gap-2 text-primary hover:bg-primary/10 px-4 py-2 rounded-full font-bold transition-all border border-primary/20"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Medicine
            </button>
          </div>

          <div className="space-y-6">
            {medications.map((med, index) => (
              <div key={index} className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest relative group">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-1">
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Medication Name</label>
                    <input 
                      type="text"
                      required
                      value={med.name}
                      onChange={(e) => handleMedChange(index, 'name', e.target.value)}
                      placeholder="Paracetamol 500mg"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-outline-variant/30 text-sm font-bold focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Dosage</label>
                    <input 
                      type="text"
                      required
                      value={med.dosage}
                      onChange={(e) => handleMedChange(index, 'dosage', e.target.value)}
                      placeholder="1 tablet"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-outline-variant/30 text-sm font-bold focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Frequency</label>
                    <input 
                      type="text"
                      required
                      value={med.frequency}
                      onChange={(e) => handleMedChange(index, 'frequency', e.target.value)}
                      placeholder="Thrice a day (After food)"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-outline-variant/30 text-sm font-bold focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Duration</label>
                    <input 
                      type="text"
                      required
                      value={med.duration}
                      onChange={(e) => handleMedChange(index, 'duration', e.target.value)}
                      placeholder="5 days"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-outline-variant/30 text-sm font-bold focus:border-primary outline-none"
                    />
                  </div>
                </div>
                {medications.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button 
            type="button" 
            onClick={() => navigate('/doctor/dashboard')}
            className="px-8 py-3 rounded-full font-headline font-bold text-on-surface-variant border-2 border-outline-variant hover:bg-surface-container-high transition-all"
          >
            Discard
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-12 py-3 rounded-full font-headline font-bold text-white bg-gradient-to-r from-primary to-primary-container shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <span className="material-symbols-outlined">send</span>
            )}
            Issue Prescription
          </button>
        </div>
      </form>
    </div>
  );
}
