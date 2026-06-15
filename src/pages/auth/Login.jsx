import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logger from '../../utils/logger';

/**
 * Login Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
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
      const { role: userRole, error } = await signIn(email, password);
      
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
      logger.error("Login Error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
      }
      // Note: redirection is handled by Supabase for OAuth
    } catch (err) {
      logger.error("Google Login Error:", err);
      setErrorMsg("Failed to initialize Google login.");
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

          {/* Google Sign In Button */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-[#cec3cc] text-on-surface py-4 rounded-full font-headline font-bold text-lg shadow-sm hover:bg-surface-container-low transition-all active:scale-[0.98] disabled:opacity-70"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-3.3 3.28-7.91 3.28-13.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

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
