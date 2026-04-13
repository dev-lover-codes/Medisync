# 🏥 MediSync: Next-Gen Digital Healthcare Ecosystem

MediSync is a premium, full-stack Hospital Management System (HMS) designed to bridge the gap between patients, doctors, and healthcare administrators. Built with a focus on **Visual Excellence**, **AI-Driven Insights**, and **Security**, MediSync transforms clinical workflows into a seamless digital experience.

---

## ✨ Key Pillars

### 1. 🧬 Unified Health Record (UHR)
Experience a 360-degree view of patient health. MediSync consolidates medical history, prescriptions, and lab results into a single, secure, and easily accessible timeline.

### 2. 🤖 AI-Powered Diagnostics
Empowering patients with an **AI Symptom Checker** that provides preliminary health guidance, helping users make informed decisions before their consultation.

### 3. ⚡ Real-Time Clinical Workflows
*   **For Doctors:** Streamlined "Write Prescription" interface, instant access to patient history, and real-time appointment status updates.
*   **For Nurses:** Integrated Bed Management and real-time monitoring of patient status.

### 4. 🏢 Smarter Resource Allocation
Manage hospital logistics with precision.
*   **Bed Management:** Real-time tracking of occupancy, bed types, and department allocation.
*   **Smart Inventory:** Automated stock tracking for essential medicines and medical supplies.

### 5. 💳 Patient Empowerment Portal
A sleek, user-centric dashboard for patients to:
*   Book appointments with top-rated specialists.
*   Access digital prescriptions instantly.
*   Manage medical bills and history in one place.

---

## 🛠 Tech Stack

*   **Frontend:** React.js, Tailwind CSS (Velvet Clinical Design System)
*   **Backend & DB:** Supabase (PostgreSQL)
*   **Authentication:** Supabase Auth with Role-Based Access Control (RBAC)
*   **Styles:** Modern aesthetics featuring glassmorphism, smooth transitions, and a premium dark-mode-first approach.

---

## 🔒 Security & Compliance

MediSync is built with a "Privacy by Design" philosophy:
*   **Row-Level Security (RLS):** Ensures patients can only access their own sensitive data.
*   **Secure Auth:** JWT-based authentication for all API requests.
*   **Data Integrity:** Multi-layered database constraints and automated triggers for consistent state management.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase Project

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dev-lover-codes/Medisync.git
    cd Medisync
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Launch the app:**
    ```bash
    npm run dev
    ```

---

## 📐 Database Architecture
The system relies on a robust schema containing tables for `profiles`, `doctors`, `appointments`, `prescriptions`, `bills`, and `medical_history`. See `database_schema.sql` for full details.

---

## 🎨 Design System: "Velvet Clinical"
The UI follows a curated palette of deep charcoals, surgical teals, and soft accents, ensuring that the interface feels both professional and welcoming.

---

**Developed with ❤️ for Modern Healthcare.**
