# MediSync

MediSync is a modern, responsive, and secure Healthcare Management System built for patients, doctors, and hospital administrators. It features an AI-driven symptom checker, real-time appointment booking, and robust administrative tools.

---

## Architecture Overview

MediSync uses a modern, serverless-oriented web architecture tailored for scalability, speed, and developer experience.

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) for lightning-fast HMR and optimized production builds.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling with custom UI components.
- **Routing**: [React Router v7](https://reactrouter.com/) for declarative client-side routing.
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for robust component and integration testing.

### Backend & Database (Supabase)
- **Database**: PostgreSQL database hosted on [Supabase](https://supabase.com/).
- **Authentication**: Built-in Supabase Auth supporting Role-Based Access Control (RBAC).
- **Security**: PostgreSQL Row Level Security (RLS) ensures users can only access their authorized data.
- **Edge Functions**: Deno-based edge functions used to securely interface with AI models (e.g., OpenAI / Gemini) without exposing API keys to the client.

---

## Local Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Supabase Project (for DB and Auth)

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd medisync
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Copy the example environment file and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key

4. **Database Setup:**
   Run the provided `database_schema.sql` script in your Supabase SQL editor to create all required tables, triggers, and Row Level Security (RLS) policies.

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

6. **Run Tests:**
   ```bash
   npm run test
   ```

---

## Supabase Database Schema

The MediSync database is carefully normalized and secured using Row Level Security (RLS). 

### Core Tables

#### `users`
Handles application users and RBAC.
- `user_id` (PK)
- `email` (Unique)
- `password_hash`
- `role` (Enum: admin, doctor, nurse, receptionist, pharmacist, patient)

#### `patients`
Stores patient demographics and contact details.
- `patient_id` (PK)
- `user_id` (FK to users)
- `uhid` (Unique Health ID, auto-generated)
- `first_name`, `last_name`, `date_of_birth`, `gender`
- *RLS*: Patients can view their own data; Admins/Staff can view all.

#### `doctors`
Profiles for medical staff.
- `doctor_id` (PK)
- `user_id` (FK to users)
- `department_id` (FK to departments)
- `specialization`, `consultation_fee`

#### `appointments`
Manages scheduling and tracking visits.
- `appointment_id` (PK)
- `patient_id` (FK), `doctor_id` (FK), `department_id` (FK)
- `status` (scheduled, completed, cancelled)
- *RLS*: Doctors see their assigned appointments; Patients see their own.

#### `medical_records` & `prescriptions`
Stores clinical data linked to appointments.
- `record_id` (PK), `appointment_id` (FK)
- `symptoms`, `diagnosis`, `notes`
- *RLS*: Only assigned doctors and the patient themselves can access these records.

#### `departments` & `beds`
Hospital infrastructure management.
- Handles OPD limits, ward allocation, and bed occupancy statuses.

#### `billing`
Financial tracking for appointments and admissions.
- Trigger-automated bill generation upon appointment completion.

#### `audit_logs`
Security and action tracking.
- Tracks critical actions (e.g., bed assignments). 
- *RLS*: Only viewable by admins.

### Automation (Triggers)
- **Auto-UHID Generation**: Assigns a unique `MED-YYYY-XXXX` ID on new patient insert.
- **OPD Limit Enforcement**: Prevents overbooking a department on a specific date.
- **Auto-Billing**: Automatically creates a pending bill when an appointment status changes to `completed`.
