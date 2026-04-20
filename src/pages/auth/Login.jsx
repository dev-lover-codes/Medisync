import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Login Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [role, setRole] = useState('Patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const roles = ['Patient', 'Doctor', 'Admin', 'Nurse', 'Pharmacist'];

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      // We try to sign in ignoring the selected role tab 
      // because Supabase auth handles role retrieval post-login
      const { user, role: userRole, error } = await signIn(email, password);
      
      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);

      if (userRole === 'patient') navigate('/patient/dashboard');
      else if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'doctor') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard'); // default fallback
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background font-body text-on-surface">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-2/5 relative overflow-hidden bg-gradient-to-br from-primary to-[#49394c] flex-col justify-center items-center text-center px-12 py-20 text-white z-0">
        {/* Decorative Abstract 3D Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary-container/20 rounded-full blur-[100px] z-[-1]"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-96 h-96 bg-secondary-container/30 rounded-full blur-[120px] z-[-1]"></div>
        
        {/* Abstract floating circles */}
        <div className="absolute top-[20%] left-[20%] w-32 h-32 border-[20px] border-white/5 rounded-full z-[-1]"></div>
        <div className="absolute bottom-[20%] right-[30%] w-48 h-48 border-[12px] border-primary-container/10 rounded-full z-[-1]"></div>
        <div className="absolute top-[40%] right-[10%] w-24 h-24 bg-white/5 rounded-full backdrop-blur-3xl z-[-1]"></div>

        {/* Content */}
        <div className="z-10 flex flex-col items-center justify-center space-y-8">
          <div className="w-24 h-24 bg-white/10 rounded-[2rem] border border-white/20 backdrop-blur-md flex justify-center items-center shadow-2xl p-4">
            <img src="/logo.svg" alt="MediSync" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <div className="space-y-4">
            <h1 className="font-headline font-extrabold text-5xl tracking-tight text-white drop-shadow-sm">
              MediSync
            </h1>
            <p className="text-xl text-primary-container font-medium max-w-sm mx-auto drop-shadow-sm">
              Intelligent Healthcare Management
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-3/5 flex justify-center items-center p-8 sm:p-12 md:p-20 bg-surface">
        <div className="w-full max-w-lg space-y-10">
          {/* Header */}
          <div className="text-center sm:text-left space-y-2">
            <h2 className="font-headline text-4xl font-bold text-on-surface">Welcome Back</h2>
            <p className="text-on-surface-variant font-medium">Sign in to your account</p>
          </div>

          {errorMsg && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
              <button type="button" onClick={() => setErrorMsg('')} className="hover:opacity-75">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Role Selector */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-on-surface-variant ml-1">Select Role</label>
              <div className="flex flex-wrap gap-2">
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm
                      ${role === r 
                        ? 'bg-primary-container text-[#49394c] ring-2 ring-primary-container/50' 
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-outline-variant/30'
                      }
                    `}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant ml-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant">mail</span>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-[#cec3cc] text-on-surface rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.02)] placeholder:text-outline-variant" 
                    placeholder="Enter your email" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-on-surface-variant">Password</label>
                  <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary-container transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant">lock</span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-[#cec3cc] text-on-surface rounded-xl pl-12 pr-12 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.02)] placeholder:text-outline-variant" 
                    placeholder="Enter your password" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors focus:outline-none"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full relative flex items-center justify-center bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-full font-headline font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                  <span className="opacity-0">Log In</span>
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-outline-variant/50"></div>
            <span className="text-sm font-medium text-on-surface-variant">or</span>
            <div className="h-[1px] flex-1 bg-outline-variant/50"></div>
          </div>

          {/* Create Account Link */}
          <div className="text-center">
            <p className="text-on-surface-variant font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
