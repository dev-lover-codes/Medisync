import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ForgotPassword — allows users to request a password reset email.
 */
export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError.message || 'Something went wrong. Please try again.');
    } else {
      setSent(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-background font-body text-on-surface items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">

        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
          </div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Forgot Password?</h1>
          <p className="text-on-surface-variant font-medium mt-2">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
          /* Success State */
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-outline-variant/20 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-green-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-xl text-on-surface">Check your inbox</h2>
              <p className="text-on-surface-variant font-medium mt-2 text-sm">
                We sent a password reset link to <strong>{email}</strong>. Check your spam folder if you don't see it.
              </p>
            </div>
            <Link
              to="/login"
              className="block w-full py-3.5 bg-primary text-white rounded-full font-headline font-bold text-center shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          /* Form State */
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-outline-variant/20 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
                <span className="material-symbols-outlined text-red-500">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant ml-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant">mail</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-surface-container-lowest border border-[#cec3cc] text-on-surface rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-outline-variant"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative flex items-center justify-center bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-full font-headline font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <div className="text-center">
              <Link to="/login" className="text-primary font-semibold text-sm hover:underline">
                ← Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
