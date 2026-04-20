import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/pages/auth/Login';
import Register from '../src/pages/auth/Register';
import BookAppointment from '../src/pages/patient/BookAppointment';
import { AuthProvider } from '../src/context/AuthContext';

// Mock the AuthContext
vi.mock('../src/context/AuthContext', async () => {
  const actual = await vi.importActual('../src/context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      login: vi.fn().mockResolvedValue({ success: true }),
      register: vi.fn().mockResolvedValue({ success: true }),
      user: { id: 1, role: 'patient' }
    })
  };
});

// Mock api
vi.mock('../src/services/api', () => ({
  dbCall: vi.fn().mockResolvedValue({ success: true, data: [{ doctor_id: 1, first_name: 'John', last_name: 'Doe' }] })
}));

describe('Authentication Flows', () => {
  it('renders login form and can submit', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    const emailInput = screen.getByPlaceholderText(/your.email@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Mock triggers navigation or state change
      expect(submitButton).toBeDisabled(); // usually loading state
    });
  });

  it('renders register form and toggles tabs', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>
    );

    const patientTab = screen.getByText(/I am a Patient/i);
    const staffTab = screen.getByText(/I am Staff/i);
    
    expect(patientTab).toBeInTheDocument();
    
    // Switch to staff tab
    fireEvent.click(staffTab);
    expect(screen.getByText(/Department/i)).toBeInTheDocument();
  });

  it('validates password mismatch on register', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/••••••••/i, { selector: 'input[name="password"]' }), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i, { selector: 'input[name="confirmPassword"]' }), { target: { value: 'pass456' } });
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });
});

describe('Appointment Booking Logic', () => {
  it('renders the appointment booking form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BookAppointment />
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Book an Appointment/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Department/i)).toBeInTheDocument();
  });

  it('allows selecting a department and doctor', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BookAppointment />
        </AuthProvider>
      </BrowserRouter>
    );

    // Mock interactions
    const deptSelect = screen.getByRole('combobox');
    fireEvent.change(deptSelect, { target: { value: '1' } }); // Select Cardiology or similar

    await waitFor(() => {
      // The mock api returns a doctor, wait for it to be rendered or available in state
      // This is a basic structural test
      expect(screen.getByText(/Select Doctor/i)).toBeInTheDocument();
    });
  });
});
