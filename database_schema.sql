-- MEDICSYNC DATABASE SCHEMA (Synchronized from remote Supabase project)

-- DEPARTMENTS TABLE
CREATE TABLE departments (
  department_id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  floor_number INTEGER,
  daily_opd_limit INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true
);

-- USERS TABLE
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'pharmacist')),
  linked_id INTEGER,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PATIENTS TABLE
CREATE TABLE patients (
  patient_id SERIAL PRIMARY KEY,
  uhid VARCHAR UNIQUE,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  date_of_birth DATE NOT NULL,
  gender CHAR(1) CHECK (gender IN ('M', 'F', 'O')),
  blood_group VARCHAR CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  phone VARCHAR NOT NULL UNIQUE,
  email VARCHAR UNIQUE,
  address TEXT,
  state VARCHAR,
  pincode VARCHAR,
  nationality VARCHAR DEFAULT 'Indian',
  guardian_relation VARCHAR CHECK (guardian_relation IN ('S/o', 'D/o', 'W/o', 'H/o')),
  guardian_name VARCHAR,
  id_type VARCHAR CHECK (id_type IN ('Aadhaar', 'Voter ID', 'Passport', 'PAN', 'Other')),
  id_number VARCHAR,
  emergency_contact_name VARCHAR,
  emergency_contact_phone VARCHAR,
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- DOCTORS TABLE
CREATE TABLE doctors (
  doctor_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  department_id INTEGER REFERENCES departments(department_id),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  specialization VARCHAR,
  qualification VARCHAR,
  phone VARCHAR,
  email VARCHAR,
  consultation_fee NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- APPOINTMENTS TABLE
CREATE TABLE appointments (
  appointment_id SERIAL PRIMARY KEY,
  opd_reg_number VARCHAR UNIQUE,
  patient_id INTEGER REFERENCES patients(patient_id),
  doctor_id INTEGER REFERENCES doctors(doctor_id),
  department_id INTEGER REFERENCES departments(department_id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  token_number INTEGER,
  status VARCHAR DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  type VARCHAR DEFAULT 'OPD' CHECK (type IN ('OPD', 'IPD', 'emergency', 'followup')),
  complaint_text TEXT,
  visit_number INTEGER DEFAULT 1,
  is_followup BOOLEAN DEFAULT false,
  parent_appointment_id INTEGER REFERENCES appointments(appointment_id),
  id_type VARCHAR,
  id_number VARCHAR,
  created_by INTEGER REFERENCES users(user_id),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- BEDS TABLE
CREATE TABLE beds (
  bed_id SERIAL PRIMARY KEY,
  bed_number VARCHAR NOT NULL,
  department_id INTEGER REFERENCES departments(department_id),
  ward_name VARCHAR,
  bed_type VARCHAR DEFAULT 'general' CHECK (bed_type IN ('general', 'ICU', 'emergency', 'private', 'maternity')),
  status VARCHAR DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
  current_patient_id INTEGER REFERENCES patients(patient_id),
  admitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- BILLING TABLE
CREATE TABLE billing (
  bill_id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(patient_id),
  appointment_id INTEGER REFERENCES appointments(appointment_id),
  consultation_fee NUMERIC DEFAULT 0,
  admission_fee NUMERIC DEFAULT 0,
  other_charges NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  payment_status VARCHAR DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'waived')),
  payment_mode VARCHAR CHECK (payment_mode IN ('cash', 'UPI', 'card', 'insurance', 'Ayushman')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- MEDICAL RECORDS TABLE
CREATE TABLE medical_records (
  record_id SERIAL PRIMARY KEY,
  appointment_id INTEGER REFERENCES appointments(appointment_id),
  patient_id INTEGER REFERENCES patients(patient_id),
  doctor_id INTEGER REFERENCES doctors(doctor_id),
  symptoms TEXT,
  diagnosis TEXT,
  notes TEXT,
  blood_pressure VARCHAR,
  temperature NUMERIC,
  pulse INTEGER,
  weight NUMERIC,
  spo2 INTEGER,
  follow_up_date DATE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PRESCRIPTIONS TABLE
CREATE TABLE prescriptions (
  prescription_id SERIAL PRIMARY KEY,
  medical_record_id INTEGER REFERENCES medical_records(record_id),
  patient_id INTEGER REFERENCES patients(patient_id),
  doctor_id INTEGER REFERENCES doctors(doctor_id),
  notes TEXT,
  is_dispensed BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  issued_at TIMESTAMPTZ DEFAULT now()
);

-- AUDIT LOGS TABLE
CREATE TABLE audit_logs (
  log_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  action VARCHAR NOT NULL,
  table_name VARCHAR,
  record_id INTEGER,
  ip_address VARCHAR,
  created_at TIMESTAMPTZ DEFAULT now()
);
