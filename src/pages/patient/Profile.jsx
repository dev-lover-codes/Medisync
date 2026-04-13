import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, profile } = useAuth();
  
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

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || '',
        blood_group: profile.blood_group || '',
        address: profile.address || '',
        emergency_contact_name: profile.emergency_contact_name || '',
        emergency_contact_phone: profile.emergency_contact_phone || '',
        known_allergies: profile.known_allergies || ''
      });
    } else if (user) {
      // In case profile context wasn't loaded fully
      fetchProfile();
    }
  }, [profile, user]);

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
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
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
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      
      // Auto dismiss success message
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ text: error.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pb-24 bg-[#faf9fa] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-manrope text-gray-800 mb-2">Profile & Settings</h1>
            <p className="text-gray-500 font-inter">Manage your personal information and preferences</p>
          </div>
          
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-[#6f5673] text-white px-6 py-2.5 rounded-full font-inter font-medium hover:bg-[#bc9ebf] transition-colors shadow-lg shadow-[#6f5673]/20"
            >
              Edit Profile
            </button>
          )}
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl mb-6 font-inter ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-50 p-8">
          
          {/* Section 1: Basic Info */}
          <div className="mb-8">
            <h2 className="text-xl font-bold font-manrope text-gray-800 mb-4 border-b border-gray-100 pb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Full Name</label>
                <input 
                  type="text" 
                  name="full_name" 
                  value={formData.full_name} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bc9ebf] transition-all disabled:opacity-70 disabled:bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-inter cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bc9ebf] transition-all disabled:opacity-70 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Date of Birth</label>
                <input 
                  type="date" 
                  name="date_of_birth" 
                  value={formData.date_of_birth} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bc9ebf] transition-all disabled:opacity-70 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bc9ebf] transition-all disabled:opacity-70 disabled:bg-gray-100"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Blood Group</label>
                <select 
                  name="blood_group" 
                  value={formData.blood_group} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bc9ebf] transition-all disabled:opacity-70 disabled:bg-gray-100"
                >
                  <option value="">Select Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Home Address</label>
                <textarea 
                  name="address" 
                  rows="3"
                  value={formData.address} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bc9ebf] transition-all disabled:opacity-70 disabled:bg-gray-100 resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 2: Medical & Emergency */}
          <div className="mb-8">
            <h2 className="text-xl font-bold font-manrope text-gray-800 mb-4 border-b border-gray-100 pb-2">Medical & Emergency Defaults</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Known Allergies</label>
                <input 
                  type="text" 
                  name="known_allergies" 
                  value={formData.known_allergies} 
                  onChange={handleChange}
                  placeholder="e.g. Penicillin, Peanuts (or leave empty)"
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bc9ebf] transition-all disabled:opacity-70 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Emergency Contact Name</label>
                <input 
                  type="text" 
                  name="emergency_contact_name" 
                  value={formData.emergency_contact_name} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bc9ebf] transition-all disabled:opacity-70 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">Emergency Contact Phone</label>
                <input 
                  type="tel" 
                  name="emergency_contact_phone" 
                  value={formData.emergency_contact_phone} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bc9ebf] transition-all disabled:opacity-70 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
              <button 
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile(); // revert changes
                }}
                className="px-6 py-2.5 rounded-full font-inter font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#6f5673] text-white px-8 py-2.5 rounded-full font-inter font-medium hover:bg-[#bc9ebf] transition-colors shadow-lg shadow-[#6f5673]/20 flex items-center justify-center min-w-[120px]"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
