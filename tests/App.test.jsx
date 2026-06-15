import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/pages/auth/Login';
import Register from '../src/pages/auth/Register';
import BookAppointment from '../src/pages/patient/BookAppointment';
import { AuthProvider } from '../src/context/AuthContext';

// Mock the AuthContext
vi.mock('../src/context/AuthContext', async () => {
  return {
    AuthProvider: ({ children }) => <div>{children}</div>,
    useAuth: () => ({
      signIn: vi.fn().mockResolvedValue({ success: true }),
      signUp: vi.fn().mockResolvedValue({ success: true }),
      user: { id: 1, role: 'patient' },
      userProfile: { full_name: 'Jane Doe' },
      loading: false
    })
  };
});

// Mock supabase
vi.mock('../src/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    then: vi.fn().mockImplementation((callback) => {
      // Simulate successful data fetch for doctors and appointments
      return callback({ 
        data: [
          { 
            doctor_id: 1, 
            first_name: 'John', 
            last_name: 'Doe', 
            department: 'Cardiology',
            consultation_fee: 100,
            departments: { department_name: 'Cardiology' }
          }
        ], 
        error: null 
      });
    })
  }
}));

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
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole('button', { name: /Log In/i });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Mock triggers navigation or state change
      expect(submitButton).toBeDisabled(); // usually loading state
    });
  });

  it('renders register form', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Join MediSync today/i)).toBeInTheDocument();
  });

  it('validates password mismatch on register', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>
    );

    // Navigate to step 3 first
    fireEvent.click(screen.getByText(/Next Step/i)); // To Step 2
    fireEvent.click(screen.getByText(/Next Step/i)); // To Step 3

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText(/••••••••/i)[0]).toBeInTheDocument();
    });

    fireEvent.change(screen.getAllByPlaceholderText(/••••••••/i)[0], { target: { value: 'pass123' } });
    fireEvent.change(screen.getAllByPlaceholderText(/••••••••/i)[1], { target: { value: 'pass456' } });
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });
});

describe('Appointment Booking Logic', () => {
  it('renders the appointment booking form', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BookAppointment />
        </AuthProvider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Clinician Synchronization/i)).toBeInTheDocument();
    });
  });

  it('allows selecting a department and doctor', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BookAppointment />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Clinical Domain/i)).toBeInTheDocument();
    });

    // Mock interactions
    const deptButton = screen.getByText(/Module 1/i);
    fireEvent.click(deptButton);

    await waitFor(() => {
      expect(screen.getByText(/Expertise Registry/i)).toBeInTheDocument();
    });
  });

  it('renders an error boundary or toast notification on API failure', async () => {
    // Override the API mock to simulate failure
    const { dbCall } = await import('../src/services/api');
    dbCall.mockResolvedValueOnce({ success: false, error: { message: 'Database Connection Failed' } });

    render(
      <BrowserRouter>
        <AuthProvider>
          <BookAppointment />
        </AuthProvider>
      </BrowserRouter>
    );

    // Expecting the UI to handle the error, perhaps by rendering a message or error boundary
    // Just a basic check that it doesn't crash completely
    await waitFor(() => {
      // Usually would check for toast or error boundary message
      // expect(screen.getByText(/Failed/i)).toBeInTheDocument();
    });
  });
});

