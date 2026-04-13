-- PROFILES TABLE (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  blood_group TEXT,
  address TEXT,
  role TEXT DEFAULT 'patient', 
  -- roles: patient, doctor
  , admin, nurse, pharmacist
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  known_allergies TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DOCTORS TABLE
CREATE TABLE doctors (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  specialization TEXT,
  department TEXT,
  experience_years INT,
  consultation_fee NUMERIC,
  rating NUMERIC DEFAULT 0,
  available_today BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- APPOINTMENTS TABLE
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id),
  doctor_id UUID REFERENCES doctors(id),
  appointment_date DATE,
  time_slot TEXT,
  department TEXT,
  reason TEXT,
  status TEXT DEFAULT 'upcoming',
  -- status: upcoming, completed, cancelled
  consultation_fee NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRESCRIPTIONS TABLE
CREATE TABLE prescriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id),
  patient_id UUID REFERENCES profiles(id),
  doctor_id UUID REFERENCES doctors(id),
  diagnosis TEXT,
  notes TEXT,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRESCRIPTION ITEMS TABLE
CREATE TABLE prescription_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID REFERENCES prescriptions(id),
  medicine_name TEXT,
  dosage TEXT,
  frequency TEXT,
  duration TEXT,
  instructions TEXT
);

-- BILLS TABLE
CREATE TABLE bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id),
  appointment_id UUID REFERENCES appointments(id),
  consultation_fee NUMERIC DEFAULT 0,
  medicine_charges NUMERIC DEFAULT 0,
  lab_charges NUMERIC DEFAULT 0,
  bed_charges NUMERIC DEFAULT 0,
  total_amount NUMERIC,
  status TEXT DEFAULT 'pending',
  -- status: pending, paid, overdue
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEDICAL HISTORY TABLE
CREATE TABLE medical_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id),
  doctor_id UUID REFERENCES doctors(id),
  visit_date DATE,
  visit_type TEXT, -- OPD, Emergency, Surgery
  department TEXT,
  diagnosis TEXT,
  notes TEXT,
  tests_done TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
-- Patients can only see their own data
CREATE POLICY "patient_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "patient_own_appointments" ON appointments
  FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "patient_own_prescriptions" ON prescriptions
  FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "patient_own_bills" ON bills
  FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "patient_own_history" ON medical_history
  FOR ALL USING (auth.uid() = patient_id);

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 
          COALESCE(NEW.raw_user_meta_data->>'role', 'patient'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
