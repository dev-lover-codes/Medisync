import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

const isUrlValid = (url) => {
  try {
    return url && url.startsWith('http') && url.includes('.');
  } catch {
    return false;
  }
}

if (!isUrlValid(supabaseUrl) || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.error("Supabase configuration is missing or invalid! UI will load in offline mode. Please check your .env file.")
}

export const supabase = (isUrlValid(supabaseUrl) && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;


