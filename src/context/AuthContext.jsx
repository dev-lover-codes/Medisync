import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

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
          console.warn("AuthContext: Supabase not initialized");
          if (isMounted) setLoading(false);
          return;
        }

        // 1. Check for current session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("AuthContext: Session Fetch Error:", sessionError);
        }

        if (currentSession?.user) {
          console.log("AuthContext: Initial session found for:", currentSession.user.id);
          if (isMounted) {
            setSession(currentSession);
            setUser(currentSession.user);
            await fetchProfile(currentSession.user.id);
          }
        } else {
          console.log("AuthContext: No initial session");
          if (isMounted) setLoading(false);
        }
      } catch (err) {
        console.error("AuthContext: Initialization failed:", err);
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log("AuthContext: Auth event:", event, newSession?.user?.id);
          
          if (isMounted) {
            if (newSession?.user) {
              setSession(newSession);
              setUser(newSession.user);
              await fetchProfile(newSession.user.id);
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

    // Safety timeout: ensure loading is set to false eventually
    const safetyTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn("AuthContext: Safety timeout reached, forcing loading false");
        setLoading(false);
      }
    }, 6000); // reduced to 6 seconds for better UX

    return () => {
      isMounted = false;
      if (authListener) authListener.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);


  const fetchProfile = async (userId) => {
    if (!supabase || !userId) {
      setLoading(false);
      return;
    }
    
    try {
      console.log("AuthContext: Fetching profile for:", userId);
      
      // Get the current auth user to use email as a fallback link
      // This is necessary because user_id in the SQL schema is an INT
      // while userId from Supabase Auth is a UUID.
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      // Try to find the user by email (most reliable link) or ID if it's numeric
      const isNumeric = /^\d+$/.test(userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${authUser?.email},user_id.eq.${isNumeric ? userId : -1}`)
        .maybeSingle(); // maybeSingle avoids the 406/404 error if not found
        
      if (error) {
        console.error('AuthContext: Profile fetch error:', error.message);
        setRole('patient'); // Default fallback
      } else if (data) {
        console.log("AuthContext: Profile found:", data.role);
        setUserProfile(data);
        setRole(data.role || 'patient');
      } else {
        console.warn("AuthContext: No profile record found for user.");
        setRole('patient');
      }
    } catch (err) {
      console.error('AuthContext: Fetch profile exception:', err);
      setRole('patient');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, fullName, role, extraData) => {
    try {
      if (!supabase) {
        throw new Error("Supabase is not initialized. Check your environment variables.");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            ...extraData
          }
        }
      });
      return { data, error };
    } catch (err) {
      console.error("Critical Sign Up Error:", err);
      return { data: null, error: err };
    }
  };

  const signIn = async (email, password) => {
    try {
      if (!supabase) {
        throw new Error("Supabase is not initialized. Check your environment variables.");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Auth Error:", error);
        return { user: null, role: null, error };
      }
      
      const { user } = data;
      if (!user) {
        throw new Error("No user returned from Supabase after successful sign in.");
      }
      
      // Fetch profile with dual check (Email or ID if numeric)
      const isNumeric = /^\d+$/.test(user.id);
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${user.email},user_id.eq.${isNumeric ? user.id : -1}`)
        .maybeSingle(); 
        
      if (profileError || !profileData) {
        console.warn("AuthContext: Profile fetch issue during sign in:", profileError?.message || "No record found");
        return { user, role: 'patient', error: null }; 
      }
      
      const sessionRole = profileData?.role || 'patient';
      setRole(sessionRole);
      setUserProfile(profileData);
      
      return { user, role: sessionRole, error: null };
    } catch (err) {
      console.error("Critical Sign In Error:", err);
      return { user: null, role: null, error: err };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/forgot-password/reset'
    });
    return { error };
  };

  const value = {
    session,
    user,
    userProfile,
    role,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
