import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logger from '../../utils/logger';

/**
 * Register Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Navigation State
  const [currentStep, setCurrentStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    bloodGroup: '',
    allergies: '', // Will treat as comma separated initially, or standard string
    emergencyName: '',
    emergencyPhone: '',
    chronicConditions: [],
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const chronicOptions = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'None'];

  // Input Handlers
  /**
 * handleChange internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /**
 * handleChronicChange internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const handleChronicChange = (condition) => {
    setFormData(prev => {
      let currentConditions = [...prev.chronicConditions];
      
      if (condition === 'None') {
        return { ...prev, chronicConditions: ['None'] };
      }
      
      currentConditions = currentConditions.filter(c => c !== 'None');
      if (currentConditions.includes(condition)) {
        currentConditions = currentConditions.filter(c => c !== condition);
      } else {
        currentConditions.push(condition);
      }
      
      return { ...prev, chronicConditions: currentConditions };
    });
  };

  /**
 * handlePhotoUpload internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Password Strength Logic
  /**
 * getPasswordStrength internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const getPasswordStrength = () => {
    const p = formData.password;
    let strength = 0;
    if (p.length >= 8) strength += 1;
    if (/[A-Z]/.test(p)) strength += 1;
    if (/[0-9]/.test(p)) strength += 1;
    if (/[^A-Za-z0-9]/.test(p)) strength += 1;
    
    if (p.length === 0) return { label: '', color: 'bg-transparent', score: 0 };
    if (strength <= 2) return { label: 'Weak', color: 'bg-red-500', score: 33 };
    if (strength === 3) return { label: 'Medium', color: 'bg-orange-500', score: 66 };
    return { label: 'Strong', color: 'bg-green-500', score: 100 };
  };

  const passStrength = getPasswordStrength();

  // Navigation Handlers
  /**
 * handleNext internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const handleNext = () => {
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
  };

  /**
 * handleBack internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (!formData.termsAccepted) {
      setErrorMsg("You must accept the terms and conditions.");
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    
    const extraData = {
      phone: formData.phone,
      date_of_birth: formData.dob,
      gender: formData.gender,
      blood_group: formData.bloodGroup,
      address: formData.address,
      known_allergies: formData.allergies,
      emergency_contact_name: formData.emergencyName,
      emergency_contact_phone: formData.emergencyPhone
    };

    try {
      // Provide default 'patient' role
      const { error } = await signUp(formData.email, formData.password, formData.fullName, 'patient', extraData);
      
      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      navigate('/patient/dashboard');
    } catch (err) {
      logger.error("Registration Error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  /**
 * renderStepIndicator internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const renderStepIndicator = () => {
    return (
      <div className="w-full mb-12">
        <div className="flex justify-between items-center relative z-10 w-full max-w-md mx-auto">
          {/* Connector Line Base */}
          <div className="absolute top-5 left-0 w-full h-[2px] bg-outline-variant/30 -z-10"></div>
          
          {/* Connector Line Fill */}
          <div 
            className="absolute top-5 left-0 h-[2px] bg-primary -z-10 transition-all duration-500" 
            style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
          ></div>

          {[
            { id: 1, label: "Personal Info" },
            { id: 2, label: "Medical Details" },
            { id: 3, label: "Account Setup" }
          ].map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-2">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-white border-2 transition-all duration-300 shadow-sm
                ${currentStep > item.id 
                  ? 'border-primary bg-primary text-white shadow-primary/30' 
                  : currentStep === item.id 
                    ? 'border-primary-container bg-primary-container text-[#49394c] ring-4 ring-primary-container/30 shadow-primary-container/40' 
                    : 'border-[#cec3cc] text-outline-variant'
                }
              `}>
                {currentStep > item.id ? <span className="material-symbols-outlined text-sm font-bold">check</span> : item.id}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${currentStep >= item.id ? 'text-primary' : 'text-outline-variant'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex bg-background font-body text-on-surface lg:h-screen lg:overflow-hidden">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-2/5 relative overflow-hidden bg-gradient-to-br from-primary to-[#49394c] flex-col justify-center items-center text-center px-12 py-20 text-white z-0 h-full">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary-container/20 rounded-full blur-[100px] z-[-1]"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-96 h-96 bg-secondary-container/30 rounded-full blur-[120px] z-[-1]"></div>
        <div className="z-10 flex flex-col items-center justify-center space-y-8">
          <div className="w-24 h-24 bg-white/10 rounded-[2rem] border border-white/20 backdrop-blur-md flex justify-center items-center shadow-2xl p-4">
             <img src="/logo.svg" alt="MediSync" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <div className="space-y-4">
            <h1 className="font-headline font-extrabold text-5xl tracking-tight text-white drop-shadow-sm">
              MediSync
            </h1>
            <p className="text-xl text-primary-container font-medium max-w-sm mx-auto drop-shadow-sm">
              Complete your patient profile
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-3/5 lg:h-full lg:overflow-y-auto flex flex-col items-center p-8 sm:p-12 md:p-16 bg-surface">
        <div className="w-full max-w-2xl space-y-8">
          
          <div className="text-center sm:text-left space-y-2 mb-4">
            <h2 className="font-headline text-4xl font-bold text-on-surface">Registration</h2>
            <p className="text-on-surface-variant font-medium">Join MediSync today</p>
          </div>

          {errorMsg && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center justify-between shadow-sm mb-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
              <button type="button" onClick={() => setErrorMsg('')} className="hover:opacity-75">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          )}

          {renderStepIndicator()}

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); if (currentStep === 3) handleSubmit(e); else handleNext(); }}>
            <div className="transition-all duration-300">
              {/* STEP 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Full Name</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-surface-container-lowest border border-[#cec3cc] rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm" placeholder="John Doe" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-surface-container-lowest border border-[#cec3cc] rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-surface-container-lowest border border-[#cec3cc] rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Date of Birth</label>
                      <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={`w-full bg-surface-container-lowest border border-[#cec3cc] rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm text-on-surface ${!formData.dob ? 'text-outline-variant' : ''}`} />
                    </div>
                  </div>

                  <div className="space-y-1 relative flex flex-col mt-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1 mb-2">Gender</label>
                    <div className="flex gap-6 items-center px-2 py-1">
                      {['Male', 'Female', 'Other'].map((g) => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="gender" value={g} onChange={handleChange} checked={formData.gender === g} className="text-primary focus:ring-primary cursor-pointer w-4 h-4" />
                          <span className="text-sm font-medium">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full bg-surface-container-lowest border border-[#cec3cc] rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm resize-none" placeholder="Enter your full address"></textarea>
                  </div>
                </div>
              )}

              {/* STEP 2: Medical Details */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Blood Group</label>
                      <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full bg-surface-container-lowest border border-[#cec3cc] text-on-surface rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm">
                        <option value="">Select Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(grp => <option key={grp} value={grp}>{grp}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Known Allergies</label>
                      <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} className="w-full bg-surface-container-lowest border border-[#cec3cc] rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm" placeholder="E.g., Penicillin, Peanuts" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Emergency Contact</label>
                      <input type="text" name="emergencyName" value={formData.emergencyName} onChange={handleChange} className="w-full bg-surface-container-lowest border border-[#cec3cc] rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm" placeholder="Relative Name" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Emergency Phone</label>
                      <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} className="w-full bg-surface-container-lowest border border-[#cec3cc] rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Chronic Conditions</label>
                    <div className="flex flex-wrap gap-3">
                      {chronicOptions.map((condition) => {
                        const isSelected = formData.chronicConditions.includes(condition);
                        return (
                          <label key={condition} className={`
                            px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer border transition-all duration-200
                            ${isSelected 
                              ? 'bg-primary-container/20 border-primary-container text-primary shadow-sm' 
                              : 'bg-surface-container-lowest border-[#cec3cc] text-on-surface-variant hover:border-primary/50'
                            }
                          `}>
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={isSelected}
                              onChange={() => handleChronicChange(condition)}
                            />
                            {condition}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Account Setup */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  {/* Photo Upload */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer w-28 h-28">
                      <div className="w-28 h-28 bg-surface-container-high rounded-full overflow-hidden border-2 border-dashed border-outline-variant flex justify-center items-center">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-4xl text-outline-variant">person</span>
                        )}
                      </div>
                      <label className="absolute inset-0 bg-black/40 rounded-full flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-3">Upload Photo</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1 relative">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Password</label>
                      <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-surface-container-lowest border border-[#cec3cc] rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
                        placeholder="••••••••" 
                      />
                      <div className="mt-2 flex items-center gap-2 h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${passStrength.color}`} style={{ width: `${passStrength.score}%` }}></div>
                      </div>
                      {passStrength.label && <p className="text-xs text-on-surface-variant font-medium mt-1 text-right">{passStrength.label}</p>}
                    </div>

                    <div className="space-y-1 relative">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Confirm Password</label>
                      <input 
                        type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-surface-container-lowest border border-[#cec3cc] rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>

                  <div className="pt-4 relative">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="mt-1 text-primary rounded focus:ring-primary border-outline-variant w-4 h-4 cursor-pointer" 
                      />
                      <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                        I agree to MediSync's <a href="#" className="font-bold text-primary hover:underline">Terms of Service</a> and <a href="#" className="font-bold text-primary hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="pt-8 mb-4 border-t border-outline-variant/20 mt-8 flex justify-between items-center">
              {currentStep > 1 ? (
                <button 
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-3.5 rounded-full font-headline font-bold text-primary border-2 border-[#cec3cc] hover:border-primary transition-colors focus:ring-2 focus:ring-primary/30"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button 
                  type="button"
                  onClick={handleNext}
                  className="px-10 py-3.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-headline font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  Next Step
                </button>
              ) : (
                <button 
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-10 py-3.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-headline font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center relative min-w-[200px]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
           <div className="text-center pb-8 lg:pb-0">
            <p className="text-on-surface-variant font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
