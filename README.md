# MediSync

MediSync is a modern, real-time hospital management system designed to streamline patient care, doctor scheduling, and hospital administration. Built with an enterprise-grade technology stack, it features role-based access control, AI-powered symptom analysis, and secure medical data management.

## Architecture Overview

*   **Frontend**: React (Vite), React Router, Tailwind CSS
*   **State & Context**: React Context API
*   **Backend & Database**: Supabase (PostgreSQL, Go)
*   **Authentication**: Supabase Auth (JWT)
*   **AI Integration**: Google Gemini API
*   **Hosting**: Google Cloud Run / Vercel

### Security & Data Integrity

*   **Row-Level Security (RLS)**: Strict Postgres RLS ensures patients can only access their own records, and doctors can only access records of assigned patients.
*   **Environment Configuration**: Secrets are handled via `.env` files locally and secure secret managers in production.
*   **Database Schema**: fully indexed foreign keys and strict relational constraints guarantee high performance and data integrity.

## Local Installation

1.  **Clone the Repository**
    \`\`\`bash
    git clone https://github.com/your-username/medisync.git
    cd medisync
    \`\`\`

2.  **Install Dependencies**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Environment Variables**
    Copy the \`.env.example\` to \`.env\` and fill in your keys:
    \`\`\`bash
    cp .env.example .env
    \`\`\`
    You will need:
    *   \`VITE_SUPABASE_URL\`
    *   \`VITE_SUPABASE_ANON_KEY\`
    *   \`VITE_GEMINI_API_KEY\`

4.  **Database Setup**
    Execute \`database_schema.sql\` in your Supabase SQL Editor to construct the schema, triggers, and Row Level Security policies.

5.  **Run Development Server**
    \`\`\`bash
    npm run dev
    \`\`\`

## AI Symptom Checker Logic

The AI Symptom Checker provides a secure, state-of-the-art triage assistant for patients. 
1.  **Input Processing**: Users enter symptoms via a secure form.
2.  **Prompt Engineering**: The input is sent to the Gemini API with a system prompt enforcing structured JSON output.
3.  **Data Validation**: The frontend strictly parses the JSON, extracting `content`, `urgency` (HIGH/MEDIUM/LOW), `conditions`, and `department`.
4.  **Fallback & Safety**: A 15-second timeout controller prevents hanging API calls. If the AI is unresponsive, the system degrades gracefully to a "Manual Evaluation Required" state.
5.  **Emergency Disclaimer**: A high-visibility disclaimer alerts users to call emergency services for critical issues.
