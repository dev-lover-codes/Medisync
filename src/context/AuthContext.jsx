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
      console.log("Fetching profile for:", userId);
      // Try to find the user by ID. We'll try both 'id' and 'user_id' as fallbacks
      // given the potential mismatch between Supabase Auth and the SQL schema.
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`id.eq.${userId},user_id.eq.${userId}`)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error.message);
        // If profile not found, we still want to let the user in as a 'patient' 
        // fallback so they aren't stuck on a loading screen.
        setRole('patient');
      } else if (data) {
        setUserProfile(data);
        setRole(data.role || 'patient');
      } else {
        setRole('patient');
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
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
      
      // Fetch profile with dual column check
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .or(`id.eq.${user.id},user_id.eq.${user.id}`)
        .single();
        
      if (profileError) {
        console.warn("Profile fetch error during sign in:", profileError);
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
