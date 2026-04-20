# 🏥 MediSync: Next-Gen Digital Healthcare Ecosystem

![MediSync Hero Banner](medisync_hero_banner_1776698583274.png)

MediSync is a premium, full-stack Hospital Management System (HMS) designed to bridge the gap between patients, doctors, and healthcare administrators. Built with a focus on **Visual Excellence**, **AI-Driven Insights**, and **Security**, MediSync transforms clinical workflows into a seamless digital experience.

---

## 🌐 Live Demo
**Deployed on Google Cloud Run:** [https://medisync-738373994270.us-central1.run.app](https://medisync-738373994270.us-central1.run.app)

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

---

## 🛠 Tech Stack

*   **Frontend:** React.js, Tailwind CSS (Velvet Clinical Design System)
*   **Backend & DB:** Supabase (PostgreSQL)
*   **Infrastructure:** Google Cloud Run (Containerized with Docker & Nginx)
*   **Authentication:** Supabase Auth with Role-Based Access Control (RBAC)
*   **Aesthetics:** Modern glassmorphism, smooth transitions, and a premium dark-mode-first approach.

---

## 🔒 Security & Compliance

MediSync is built with a "Privacy by Design" philosophy:
*   **Row-Level Security (RLS):** Ensures patients can only access their own sensitive data.
*   **Secure Auth:** JWT-based authentication for all API requests.
*   **Data Integrity:** Multi-layered database constraints and automated triggers for consistent state management.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- Google Cloud SDK (for deployment)
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
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Launch Local Development:**
    ```bash
    npm run dev
    ```

---

## ☁️ Deployment (Google Cloud Run)

The project is configured for seamless deployment to Cloud Run using Docker.

1.  **Build and Deploy:**
    ```bash
    gcloud run deploy medisync --source . --region us-central1 --allow-unauthenticated
    ```
2.  **Important Note:** Ensure `.gcloudignore` includes your `.env` file during the build process so Vite can bake the environment variables into the static build.

---

## 📐 Database Architecture
The system relies on a robust schema containing tables for `profiles`, `doctors`, `appointments`, `prescriptions`, `bills`, and `medical_history`. Full schema available in `database_schema.sql`.

---

## 🎨 Design System: "Velvet Clinical"
The UI follows a curated palette of deep charcoals, surgical teals, and soft accents, ensuring that the interface feels both professional and welcoming.

---

**Developed with ❤️ for Modern Healthcare.**
