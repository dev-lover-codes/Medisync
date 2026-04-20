import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import logger from './utils/logger';

/**
 * Profile Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function Profile() {
  const { user, userProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    known_allergies: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('Personal Info');

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        phone: userProfile.phone || '',
        date_of_birth: userProfile.date_of_birth || '',
        gender: userProfile.gender || '',
        blood_group: userProfile.blood_group || '',
        address: userProfile.address || '',
        emergency_contact_name: userProfile.emergency_contact_name || '',
        emergency_contact_phone: userProfile.emergency_contact_phone || '',
        known_allergies: userProfile.known_allergies || ''
      });
    } else if (user) {
      fetchProfile();
    }
  }, [userProfile, user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          blood_group: data.blood_group || '',
          address: data.address || '',
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_phone: data.emergency_contact_phone || '',
          known_allergies: data.known_allergies || ''
        });
      }
    } catch (error) {
      logger.error("Error fetching profile:", error);
    }
  };

  /**
 * handleChange internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const handleChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          blood_group: formData.blood_group,
          address: formData.address,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          known_allergies: formData.known_allergies
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setMessage({ text: 'Identity parameters synchronized successfully.', type: 'success' });
      setIsEditing(false);
      
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    } catch (error) {
      logger.error("Error updating profile:", error);
      setMessage({ text: error.message || 'Synchronization failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['Personal Info', 'Security', 'Notifications', 'Payments'];

  return (
    <div className="p-4 md:p-8 pb-24 bg-surface min-h-screen font-body max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight leading-none mb-3">Identity Center</h1>
          <p className="text-on-surface-variant font-medium">Manage your clinical identity and account protocols.</p>
        </div>
        {!isEditing && activeTab === 'Personal Info' && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-primary text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-95 transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-lg">edit_note</span>
            Initialize Modification
          </button>
        )}
      </div>

      {/* Persistence State Feedback */}
      {message.text && (
        <div className={`fixed bottom-8 right-8 z-[100] flex items-center bg-white shadow-2xl rounded-3xl p-5 border-l-8 animate-slide-up ${message.type === 'success' ? 'border-emerald-500' : 'border-rose-500'}`}>
          <div className={`${message.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'} rounded-2xl p-3 mr-5`}>
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{message.type === 'success' ? 'verified' : 'error'}</span>
          </div>
          <div>
            <p className="text-sm font-black text-on-surface uppercase tracking-tight">{message.type === 'success' ? 'Operation Verified' : 'Sync Conflict'}</p>
            <p className="text-xs text-on-surface-variant font-medium">{message.text}</p>
          </div>
          <button onClick={() => setMessage({ text: '', type: '' })} className="ml-8 material-symbols-outlined text-on-surface-variant/40 hover:text-on-surface transition-colors">close</button>
        </div>
      )}

      {/* Navigation Protocols */}
      <div className="flex space-x-12 border-b border-outline-variant/20 mb-12 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => { if (!loading) setActiveTab(tab); }}
            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab ? 'text-primary' : 'text-on-surface-variant/40 hover:text-on-surface'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full animate-pulse"></div>}
          </button>
        ))}
      </div>

      <div className="max-w-5xl space-y-12 pb-24">
        {activeTab === 'Personal Info' && (
          <form onSubmit={handleSave} className="space-y-10 animate-fade-in">
            {/* Visual Header / Avatar Area */}
            <div className="bg-surface-container-lowest rounded-[3rem] p-10 flex items-center space-x-10 shadow-sm border border-outline-variant/10 group">
              <div className="relative">
                <div 
                  className={`w-36 h-36 rounded-[2.5rem] overflow-hidden border-4 border-surface-container-low shadow-inner transition-transform duration-500 ${isEditing ? 'scale-110 shadow-2xl ring-4 ring-primary/20' : ''}`}
                >
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Clinical Subject ID: 994021" 
                    src={userProfile?.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuB7o7SfP3cfxPJ9TiO7IaX06Ho1Hr5oVlORJEUVlTr3dPGmDCNuFiz5WZFU3ZHP7CClaJX8EwXS81xbsYLuSW_F7hmOXY0y81R_6vU1l-rDZ0e6BiufusErK1suH4uLe2bq2rprmJYR_j8yHb72uJjn0Nq1BvhkuPzJXpxo2kiX8z4OTMUlnpZta62-7IYQDsQ9lt9b0JV5TiS0pNxQg2NTNbdiGMX6t0-IkRleT3IX7ph23GwPDr7JaZrq42n7TWpUxteta60iJ78"}
                  />
                </div>
                {isEditing && (
                  <button type="button" className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">add_a_photo</span>
                  </button>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-headline font-black text-2xl tracking-tighter text-on-surface">{formData.full_name || 'Subject Unidentified'}</h3>
                  <span className="px-3 py-1 bg-surface-container-low border border-outline-variant/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">Patient Grade A</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button type="button" className="px-6 py-2.5 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-all">Identity Audit</button>
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest opacity-40">Registered: Oct 2023</p>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-surface-container-lowest p-10 rounded-[3rem] border border-outline-variant/10 shadow-sm space-y-8">
                <h4 className="font-headline font-black text-sm uppercase tracking-[0.2em] text-on-surface-variant/60 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>fingerprint</span>
                  Entity Parameters
                </h4>
                <div className="space-y-6">
                  <div className="group/field">
                    <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 ml-1 opacity-50">Legal Nomenclature</label>
                    <div className={`flex items-center bg-surface-container-low px-5 py-4 rounded-2xl border transition-all ${isEditing ? 'border-primary/30 ring-4 ring-primary/5 bg-white' : 'border-transparent'}`}>
                      <input 
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-black text-on-surface placeholder-on-surface-variant/20" 
                        type="text" 
                        name="full_name" 
                        value={formData.full_name} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Full Name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 ml-1 opacity-50">Communication Hub</label>
                      <div className={`flex items-center bg-surface-container-low px-5 py-4 rounded-2xl border transition-all ${isEditing ? 'border-primary/30 ring-4 ring-primary/5 bg-white' : 'border-transparent'}`}>
                        <input 
                          className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-black text-on-surface" 
                          type="text" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="+91 00000 00000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 ml-1 opacity-50">Temporal Origin</label>
                      <div className={`flex items-center bg-surface-container-low px-5 py-4 rounded-2xl border transition-all ${isEditing ? 'border-primary/30 ring-4 ring-primary/5 bg-white' : 'border-transparent'}`}>
                        <input 
                          className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-black text-on-surface" 
                          type="date" 
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 ml-1 opacity-50">Biosolar Type</label>
                      <div className={`flex items-center bg-surface-container-low px-5 py-4 rounded-2xl border transition-all ${isEditing ? 'border-primary/30 ring-4 ring-primary/5 bg-white' : 'border-transparent'}`}>
                        <select 
                          className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-black text-on-surface"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          disabled={!isEditing}
                        >
                          <option value="">Unassigned</option>
                          <option value="Male">Masculine</option>
                          <option value="Female">Feminine</option>
                          <option value="Other">Non-Binary</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 ml-1 opacity-50">Hemotype</label>
                      <div className={`flex items-center bg-surface-container-low px-5 py-4 rounded-2xl border transition-all ${isEditing ? 'border-primary/30 ring-4 ring-primary/5 bg-white' : 'border-transparent'}`}>
                        <select 
                          className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-black text-on-surface"
                          name="blood_group"
                          value={formData.blood_group}
                          onChange={handleChange}
                          disabled={!isEditing}
                        >
                          <option value="">Unmapped</option>
                          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-10 rounded-[3rem] border border-outline-variant/10 shadow-sm space-y-8">
                <h4 className="font-headline font-black text-sm uppercase tracking-[0.2em] text-on-surface-variant/60 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  Geospatial Coordinates
                </h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 ml-1 opacity-50">Primary Residence</label>
                    <div className={`flex items-center bg-surface-container-low px-5 py-4 rounded-[2rem] border transition-all ${isEditing ? 'border-primary/30 ring-4 ring-primary/5 bg-white' : 'border-transparent'}`}>
                      <textarea 
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-black text-on-surface resize-none min-h-[160px]" 
                        rows="5"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Input coordinate vectors..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-start gap-4">
                     <span className="material-symbols-outlined text-primary text-xl mt-1">info</span>
                     <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest leading-relaxed">Residency updates trigger an automated notification to your affiliated clinical dispatch.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Defaults Section */}
            <div className="bg-on-surface p-12 rounded-[5rem] relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transition-transform duration-[3s] group-hover:scale-150 group-hover:rotate-12">
                  <span className="material-symbols-outlined text-[200px] text-white font-light">vital_signs</span>
               </div>
               <div className="relative z-10 space-y-12">
                  <h4 className="font-headline font-black text-xl uppercase tracking-[0.3em] text-white/40 flex items-center gap-4">
                    <span className="w-12 h-[2px] bg-white/20"></span>
                    Clinical Protocols
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Immunological Sensitivities</label>
                      <div className={`p-8 rounded-[2.5rem] border transition-all ${isEditing ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5'}`}>
                         <textarea 
                           className="w-full bg-transparent border-none p-0 focus:ring-0 text-lg font-black text-white placeholder-white/10 resize-none"
                           name="known_allergies"
                           value={formData.known_allergies}
                           onChange={handleChange}
                           disabled={!isEditing}
                           placeholder="List allergens..."
                         ></textarea>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Emergency Intervention Default</label>
                      <div className="grid grid-cols-1 gap-6">
                        <div className={`p-6 rounded-[2rem] border flex items-center gap-6 transition-all ${isEditing ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5'}`}>
                           <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/60">
                              <span className="material-symbols-outlined text-3xl">person_alert</span>
                           </div>
                           <div className="flex-1">
                              <input 
                                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-black text-white uppercase tracking-widest"
                                name="emergency_contact_name"
                                value={formData.emergency_contact_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Contact Name"
                              />
                              <input 
                                className="w-full bg-transparent border-none p-0 focus:ring-0 text-[10px] font-black text-white/40 uppercase tracking-widest mt-1"
                                name="emergency_contact_phone"
                                value={formData.emergency_contact_phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Contact Vector"
                              />
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Action Footer */}
            {isEditing && (
              <div className="flex justify-end items-center gap-8 pt-10 border-t border-outline-variant/10">
                <button 
                  type="button"
                  onClick={() => { setIsEditing(false); fetchProfile(); }}
                  disabled={loading}
                  className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-on-surface transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-16 py-6 bg-primary text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 hover:scale-95 transition-all flex items-center gap-4"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">verified</span>
                      Commit Identity Synchrony
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        )}

        {activeTab === 'Security' && (
          <div className="animate-fade-in space-y-12">
            <div className="bg-rose-50 p-12 rounded-[5rem] border border-rose-100 flex items-center gap-12 group">
               <div className="w-24 h-24 bg-rose-200 rounded-[2rem] flex items-center justify-center text-rose-600 group-hover:rotate-12 transition-transform">
                  <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>gshield</span>
               </div>
               <div>
                  <h3 className="text-3xl font-black text-rose-900 tracking-tighter mb-2">Hardened Access Control</h3>
                  <p className="text-rose-700/60 font-medium max-w-xl">Identity security is managed via end-to-end encrypted session tokens. Multi-factor authentication is enforced across all privileged clinic operations.</p>
               </div>
            </div>
            {/* Security placeholder cards... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="bg-surface-container-lowest p-10 rounded-[3rem] border border-outline-variant/10 opacity-30 cursor-not-allowed">
                  <p className="font-black text-[10px] uppercase tracking-[0.2em] mb-4">Encryption Keys</p>
                  <p className="text-sm font-medium">Hardware security module integration active.</p>
               </div>
               <div className="bg-surface-container-lowest p-10 rounded-[3rem] border border-outline-variant/10 opacity-30 cursor-not-allowed">
                  <p className="font-black text-[10px] uppercase tracking-[0.2em] mb-4">Registry Logs</p>
                  <p className="text-sm font-medium">Audit trail synchronization in progress.</p>
               </div>
            </div>
          </div>
        )}

        {/* ... Other tabs placeholders ... */}
        {(activeTab === 'Notifications' || activeTab === 'Payments') && (
          <div className="py-40 text-center opacity-20">
             <span className="material-symbols-outlined text-8xl mb-6">construction</span>
             <h3 className="text-2xl font-black uppercase tracking-[0.3em]">{activeTab} Interface Synchronizing</h3>
          </div>
        )}
      </div>
    </div>
  );
}

