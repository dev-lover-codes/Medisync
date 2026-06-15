# 🏥 MediSync — Healthcare & Hospital Management Platform

[![CI/CD Pipeline](https://github.com/dev-lover-codes/Medisync/actions/workflows/deploy.yml/badge.svg)](https://github.com/dev-lover-codes/Medisync/actions)
[![Keep Supabase Alive](https://github.com/dev-lover-codes/Medisync/actions/workflows/keep-alive.yml/badge.svg)](https://github.com/dev-lover-codes/Medisync/actions)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini API](https://img.shields.io/badge/Google-Gemini_API-8E75C2?logo=google-gemini&logoColor=white)](https://ai.google.dev/)

MediSync is a modern, real-time hospital management system designed to streamline patient care, doctor scheduling, billing operations, and hospital administration. Built with an enterprise-grade technology stack, it features secure role-based access control, AI-powered symptom analysis, and robust medical data management.

---

## 🚀 Key Features

### 👤 Patient Portal
*   **AI Symptom Checker**: Smart triage system using Google's Gemini API to assess symptoms and recommend matching medical departments.
*   **Appointment Booking**: Real-time booking by department and available doctors.
*   **Medical History & Prescriptions**: Secure view of visit summaries, diagnoses, active prescriptions, and refill request submissions.
*   **Billing & Payments**: Integrated invoicing system for monitoring pending payments and payment status.

### 🩺 Doctor & Staff Dashboards
*   **Doctor Panel**: View scheduled appointments, record diagnosis details, write medical history, and issue digital prescriptions.
*   **Role-Based Access Control**: Separate, secure access pathways tailored for doctors, nurses, pharmacists, and administrators.

### ⚙️ Administrator Console
*   **System Analytics**: Real-time statistics on total registered patients, active doctors, daily appointment trends, and pending billing.

---

## 🛠️ Architecture & Tech Stack

*   **Frontend**: [React 19](https://react.dev/) (Vite), [React Router](https://reactrouter.com/) (modern client routing), [Tailwind CSS](https://tailwindcss.com/) (fluid, responsive UI).
*   **Backend Database**: [Supabase](https://supabase.com/) (PostgreSQL) hosting tables for users, profiles, appointments, bills, prescriptions, and medical history.
*   **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth) utilizing secure JSON Web Tokens (JWT).
*   **AI Engine**: [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash`) for instant triage assessment.
*   **CI/CD Pipeline**: GitHub Actions for lint verification, automated Vitest coverage testing, and production builds.

---

## 🔒 Security & Data Integrity

*   **Row-Level Security (RLS)**: PostgreSQL RLS policies guarantee strict isolation: patients see only their own medical/billing files; doctors view only files assigned to their patients.
*   **Environment Configuration**: Environment variables (`.env`) ensure credentials are kept separate from code.
*   **Relational Integrity**: Foreign key constraints, unique key checks, and transaction controls prevent orphaned data.

---

## ⚙️ Local Installation & Setup

### 1. Clone & Navigate
```bash
git clone https://github.com/dev-lover-codes/Medisync.git
cd Medisync
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root folder with your credentials:
```env
# Supabase Keys
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# AI Integration
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Database Initialization
Execute the SQL DDL statements in [database_schema.sql](file:///home/user/Medisync/database_schema.sql) inside the Supabase SQL Editor. This sets up tables, constraints, trigger functions, and RLS policies.

### 5. Launch the Server
```bash
npm run dev
```

---

## 🤖 AI Symptom Checker & Triage

The AI Symptom Checker is built with a resilient, safety-first workflow:
1.  **Structured Prompting**: User inputs are formatted and sent to Gemini with instructions to output strict, parsing-friendly JSON containing `content`, `urgency`, `conditions`, and `department`.
2.  **Graceful Fallbacks**: An `AbortController` limits API execution to a maximum of 15 seconds. If the API times out or returns malformed text, the application automatically handles the error and falls back to a clean instructions state.
3.  **Emergency Detection**: High-visibility UI components warn users to dial emergency services for critical, high-urgency symptoms.

---

## 💤 Supabase Keep-Alive Cron

Free-tier Supabase databases automatically pause after a period of inactivity. To prevent database sleep and maintain immediate application responsiveness, MediSync uses an automated keep-alive pipeline:
*   **Automatic Workflow**: Located at [.github/workflows/keep-alive.yml](file:///home/user/Medisync/.github/workflows/keep-alive.yml), a GitHub Action runs automatically every 5 days using a cron job trigger.
*   **Database Wake-Up**: The Action performs an authenticated `GET` request directly to the `/rest/v1/departments` database REST endpoint, triggering a database query that keeps PostgreSQL active.
*   **GitHub Secrets**: Utilizes `secrets.SUPABASE_URL` and `secrets.SUPABASE_ANON_KEY` configured securely inside the GitHub repository settings.
