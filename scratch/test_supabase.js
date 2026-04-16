import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://suzhqkydzafgugeyqcxi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1emhxa3lkemFmZ3VnZXlxY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NzAxMDgsImV4cCI6MjA5MTU0NjEwOH0.D5DDgZUc9ksSiVv-aeopbsHeZa90gEVmlNud7_vREvU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing connection to Supabase...');
  try {
    const { data, error } = await supabase.from('patients').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Connection test failed:', error.message);
    } else {
      console.log('--- CONNECTION SUCCESSFUL! ---');
      console.log('Verified access to "patients" table.');
    }
  } catch (err) {
    console.error('Unexpected error during test:', err.message);
  }
}

testConnection();
