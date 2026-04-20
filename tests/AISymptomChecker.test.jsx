import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AISymptomChecker from '../src/pages/patient/AISymptomChecker';
import { AuthProvider } from '../src/context/AuthContext';

// Mock AuthContext
vi.mock('../src/context/AuthContext', async () => {
  const actual = await vi.importActual('../src/context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      userProfile: { full_name: 'Jane Doe', image_url: '' }
    })
  };
});

describe('AISymptomChecker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  it('renders the emergency disclaimer', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AISymptomChecker />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/FOR MEDICAL EMERGENCIES, PLEASE CALL/i)).toBeInTheDocument();
  });

  it('shows timeout error when API takes longer than 15 seconds', async () => {
    // Mock global fetch to just wait infinitely
    global.fetch = vi.fn(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <AuthProvider>
          <AISymptomChecker />
        </AuthProvider>
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Describe symptomatic vectors/i);
    const button = screen.getByRole('button', { name: /Send symptoms/i });

    fireEvent.change(input, { target: { value: 'I have a severe headache.' } });
    fireEvent.click(button);

    // Fast forward 15 seconds
    await vi.advanceTimersByTimeAsync(15000);

    await waitFor(() => {
      expect(screen.getByText(/The AI service is taking too long to respond/i)).toBeInTheDocument();
    });
  });
});
