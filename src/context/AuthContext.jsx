import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { authService } from '../services/authService';
import logger from '../utils/logger';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let authListener = null;

    const initializeAuth = async () => {
      try {
        if (!supabase) {
          logger.warn("AuthContext: Supabase not initialized");
          if (isMounted) setLoading(false);
          return;
        }

        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) logger.error("AuthContext: Session Fetch Error:", sessionError);

        if (currentSession?.user) {
          logger.info("AuthContext: Initial session found for:", currentSession.user.id);
          if (isMounted) {
            setSession(currentSession);
            setUser(currentSession.user);
            const profile = await authService.fetchProfile(currentSession.user.id, currentSession.user.email);
            if (isMounted) {
              setUserProfile(profile);
              setRole(profile?.role || 'patient');
            }
          }
        } else {
          logger.info("AuthContext: No initial session");
          if (isMounted) setLoading(false);
        }
      } catch (err) {
        logger.error("AuthContext: Initialization failed:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          logger.info("AuthContext: Auth event:", event, newSession?.user?.id);
          
          if (isMounted) {
            if (newSession?.user) {
              setSession(newSession);
              setUser(newSession.user);
              const profile = await authService.fetchProfile(newSession.user.id, newSession.user.email);
              if (isMounted) {
                setUserProfile(profile);
                setRole(profile?.role || 'patient');
              }
            } else if (event === 'SIGNED_OUT' || !newSession) {
              setSession(null);
              setUser(null);
              setUserProfile(null);
              setRole(null);
              setLoading(false);
            }
          }
        }
      );
      authListener = subscription;
    }

    const safetyTimeout = setTimeout(() => {
      setLoading((prevLoading) => {
        if (isMounted && prevLoading) {
          logger.warn("AuthContext: Safety timeout reached, forcing loading false");
          return false;
        }
        return prevLoading;
      });
    }, 6000);

    return () => {
      isMounted = false;
      if (authListener) authListener.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  
     
  }, []);

  const signUp = async (email, password, fullName, role, extraData) => {
    return await authService.signUp(email, password, fullName, role, extraData);
  };

  const signIn = async (email, password) => {
    const res = await authService.signIn(email, password);
    if (!res.error && res.user) {
      setUser(res.user);
      setRole(res.role);
      setUserProfile(res.profileData);
    }
    return res;
  };

  const signInWithGoogle = async () => {
    return await authService.signInWithGoogle();
  };

  const signOut = async () => {
    const res = await authService.signOut();
    if (!res.error) {
      setSession(null);
      setUser(null);
      setUserProfile(null);
      setRole(null);
    }
    return res;
  };

  const resetPassword = async (email) => {
    return await authService.resetPassword(email);
  };

  const value = {
    session,
    user,
    userProfile,
    role,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
