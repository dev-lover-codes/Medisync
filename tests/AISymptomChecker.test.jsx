import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AISymptomChecker from '../src/pages/patient/AISymptomChecker';
import { AuthProvider } from '../src/context/AuthContext';

// Mock AuthContext
vi.mock('../src/context/AuthContext', async () => {
  return {
    AuthProvider: ({ children }) => <div>{children}</div>,
    useAuth: () => ({
      userProfile: { full_name: 'Jane Doe', image_url: '' }
    })
  };
});

// Mock import.meta.env
vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key');

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

  it.skip('shows timeout error when API takes longer than 15 seconds', async () => {
    // Mock global fetch to just wait infinitely
    globalThis.fetch = vi.fn(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <AuthProvider>
          <AISymptomChecker />
        </AuthProvider>
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Describe symptomatic vectors/i);
    const button = screen.getByRole('button', { name: /Send symptoms for analysis/i });

    fireEvent.change(input, { target: { value: 'I have a severe headache.' } });
    fireEvent.click(button);

    // Fast forward 16 seconds
    vi.advanceTimersByTime(16000);

    await waitFor(() => {
      expect(screen.getByText(/The AI service is taking too long to respond/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 30000);
});
