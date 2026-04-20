import { supabase } from '../lib/supabaseClient';
import logger from '../utils/logger';

export const authService = {
  async fetchProfile(userId, authEmail) {
    if (!supabase || !userId) return null;
    
    try {
      logger.info("Fetching profile for:", userId);
      const isNumeric = /^\\d+$/.test(userId);
      
      let query = supabase.from('users').select('*');
      if (authEmail) {
        query = query.or(`email.eq.${authEmail},user_id.eq.${isNumeric ? userId : -1}`);
      } else {
        query = query.eq(isNumeric ? 'user_id' : 'id', userId);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) {
        logger.error('Profile fetch error:', error.message);
        return null;
      }
      
      return data;
    } catch (err) {
      logger.error('Fetch profile exception:', err);
      return null;
    }
  },

  async signUp(email, password, fullName, role, extraData) {
    try {
      if (!supabase) throw new Error("Supabase is not initialized.");
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role, ...extraData }
        }
      });
      return { data, error };
    } catch (err) {
      logger.error("Critical Sign Up Error:", err);
      return { data: null, error: err };
    }
  },

  async signIn(email, password) {
    try {
      if (!supabase) throw new Error("Supabase is not initialized.");
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        logger.error("Auth Error:", error);
        return { user: null, role: null, error };
      }
      
      const { user } = data;
      if (!user) throw new Error("No user returned from Supabase after successful sign in.");
      
      const profileData = await this.fetchProfile(user.id, user.email);
      const sessionRole = profileData?.role || 'patient';
      
      return { user, role: sessionRole, profileData, error: null };
    } catch (err) {
      logger.error("Critical Sign In Error:", err);
      return { user: null, role: null, error: err };
    }
  },

  async signOut() {
    if (!supabase) return { error: null };
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email) {
    if (!supabase) return { error: null };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/forgot-password/reset'
    });
    return { error };
  }
};
