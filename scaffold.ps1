$baseDir = "d:\Faiz\Codes\DBMS\medisync\src"

$folders = @(
    "pages",
    "pages\auth",
    "pages\patient",
    "pages\admin",
    "pages\doctor",
    "components\shared",
    "services",
    "context"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path "$baseDir\$folder" | Out-Null
}

$files = @{
    "pages\LandingPage.jsx" = "export default function LandingPage() { return <div className='p-8'><h1 className='text-4xl font-display text-primary'>MediSync</h1><p>Welcome to MediSync Health Management.</p></div>; }"
    "pages\auth\Login.jsx" = "export default function Login() { return <div className='p-8'><h1>Login</h1></div>; }"
    "pages\auth\Register.jsx" = "export default function Register() { return <div className='p-8'><h1>Register</h1></div>; }"
    "pages\auth\ForgotPassword.jsx" = "export default function ForgotPassword() { return <div className='p-8'><h1>Forgot Password</h1></div>; }"
    "pages\patient\Dashboard.jsx" = "export default function Dashboard() { return <div className='p-8'><h1>Patient Dashboard</h1></div>; }"
    "pages\patient\Appointments.jsx" = "export default function Appointments() { return <div className='p-8'><h1>Appointments</h1></div>; }"
    "pages\patient\Prescriptions.jsx" = "export default function Prescriptions() { return <div className='p-8'><h1>Prescriptions</h1></div>; }"
    "pages\patient\MedicalHistory.jsx" = "export default function MedicalHistory() { return <div className='p-8'><h1>Medical History</h1></div>; }"
    "pages\patient\Bills.jsx" = "export default function Bills() { return <div className='p-8'><h1>Bills</h1></div>; }"
    "pages\patient\Profile.jsx" = "export default function Profile() { return <div className='p-8'><h1>Profile</h1></div>; }"
    "pages\patient\BookAppointment.jsx" = "export default function BookAppointment() { return <div className='p-8'><h1>Book Appointment</h1></div>; }"
    "pages\patient\AISymptomChecker.jsx" = "export default function AISymptomChecker() { return <div className='p-8'><h1>AI Symptom Checker</h1></div>; }"
    "pages\admin\AdminDashboard.jsx" = "export default function AdminDashboard() { return <div className='p-8'><h1>Admin Dashboard</h1></div>; }"
    "pages\admin\BedManagement.jsx" = "export default function BedManagement() { return <div className='p-8'><h1>Bed Management</h1></div>; }"
    "pages\admin\Inventory.jsx" = "export default function Inventory() { return <div className='p-8'><h1>Inventory</h1></div>; }"
    "pages\doctor\DoctorDashboard.jsx" = "export default function DoctorDashboard() { return <div className='p-8'><h1>Doctor Dashboard</h1></div>; }"
    "pages\doctor\WritePrescription.jsx" = "export default function WritePrescription() { return <div className='p-8'><h1>Write Prescription</h1></div>; }"
    "components\shared\Sidebar.jsx" = "export default function Sidebar() { return <aside className='w-64 bg-surface h-screen shadow-md p-4'>Sidebar</aside>; }"
    "components\shared\Navbar.jsx" = "export default function Navbar() { return <header className='h-16 bg-white shadow-sm flex items-center px-6'>Navbar</header>; }"
    "components\shared\Card.jsx" = "export default function Card({children, className=''}) { return <div className={`card ${className}`}>{children}</div>; }"
    "components\shared\Modal.jsx" = "export default function Modal({children, isOpen}) { if(!isOpen) return null; return <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center'>{children}</div>; }"
    "components\shared\Button.jsx" = "export default function Button({children, variant='primary', className='', ...props}) { return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>; }"
    "components\shared\Badge.jsx" = "export default function Badge({children}) { return <span className='px-2 py-1 text-xs rounded-full bg-secondary-container text-primary-fixed-variant'>{children}</span>; }"
    "services\api.js" = "import axios from 'axios';`n`nconst api = axios.create({ baseURL: 'http://localhost:5000/api' });`n`nexport default api;"
    "context\AuthContext.jsx" = "import { createContext, useContext, useState } from 'react';`n`nconst AuthContext = createContext();`n`nexport const AuthProvider = ({ children }) => { const [user, setUser] = useState(null); return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>; };`n`nexport const useAuth = () => useContext(AuthContext);"
}

foreach ($item in $files.GetEnumerator()) {
    $filePath = "$baseDir\$($item.Name)"
    Set-Content -Path $filePath -Value $item.Value -Encoding UTF8
}
