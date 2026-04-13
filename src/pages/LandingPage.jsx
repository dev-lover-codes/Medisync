import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col">
      {/* NAVBAR */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/20">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 text-primary cursor-pointer">
            <span className="material-symbols-outlined text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
            <span className="text-2xl font-extrabold font-headline tracking-tight">MediSync</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-semibold text-on-surface-variant font-body">
            <a href="#features" className="hover:text-primary transition-colors duration-300">Features</a>
            <a href="#about" className="hover:text-primary transition-colors duration-300">About</a>
            <a href="#contact" className="hover:text-primary transition-colors duration-300">Contact</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-6 py-2 rounded-full font-headline font-bold text-primary border-2 border-primary hover:bg-primary-container/20 transition-colors active:scale-95"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2 rounded-full font-headline font-bold text-white bg-gradient-to-r from-primary to-primary-container shadow-md shadow-primary/20 hover:opacity-90 hover:shadow-lg transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative px-6 py-20 lg:py-32 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex-1 space-y-8 z-10 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-extrabold font-headline tracking-tight leading-tight text-on-surface">
              Your Health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
                Intelligently Managed
              </span>
            </h1>
            <p className="text-xl text-on-surface-variant font-body max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Experience the next generation of hospital management. MediSync creates a seamless, tactile digital sanctuary for both patients and healthcare providers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                to="/patient/book-appointment" 
                className="px-8 py-4 w-full sm:w-auto bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-headline font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Book Appointment
              </Link>
              <a 
                href="#learn-more" 
                className="px-8 py-4 w-full sm:w-auto bg-surface-container-high text-primary rounded-full font-headline font-bold text-lg hover:bg-surface-container-highest transition-colors active:scale-95 flex items-center justify-center gap-2"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex justify-center">
            {/* 3D Mock Patient Dashboard Card */}
            <div className="w-full max-w-md bg-secondary-container rounded-[2rem] p-8 shadow-[0_20px_60px_-15px_rgba(188,158,191,0.5)] transform lg:rotate-2 relative z-10 border border-primary-container/30">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-white/60 rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-primary text-3xl">ecg</span>
                </div>
                <div>
                  <h3 className="font-headline font-extrabold text-xl text-on-surface">John Doe</h3>
                  <p className="text-on-surface-variant text-sm font-medium">Patient ID: PAT-8421</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/60 rounded-xl p-4 shadow-sm backdrop-blur-md flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">calendar_clock</span>
                    <span className="font-semibold text-on-surface">Next Checkup</span>
                  </div>
                  <span className="font-bold text-primary">Tomorrow, 10:00 AM</span>
                </div>
                
                <div className="bg-white/60 rounded-xl p-4 shadow-sm backdrop-blur-md flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">prescriptions</span>
                    <span className="font-semibold text-on-surface">Active Meds</span>
                  </div>
                  <span className="font-bold text-primary">2 Pending</span>
                </div>
              </div>
            </div>
            
            {/* Decorative blobs behind the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-surface px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold font-headline text-on-surface">Powerful Features</h2>
              <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto">Built from the ground up to support modern clinical workflows.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl p-8 transition-transform hover:-translate-y-2 border border-outline-variant/10 shadow-[0_0_40px_rgba(0,0,0,0.05)] text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-primary mb-6 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <h3 className="text-xl font-bold font-headline mb-3 text-on-surface">AI Symptom Checker</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Get instant preliminary assessments and guided recommendations powered by our advanced clinical AI agent.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl p-8 transition-transform hover:-translate-y-2 border border-outline-variant/10 shadow-[0_0_40px_rgba(0,0,0,0.05)] text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-primary mb-6 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">event_available</span>
                </div>
                <h3 className="text-xl font-bold font-headline mb-3 text-on-surface">Smart Appointments</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Schedule, reschedule, or cancel appointments effortlessly. Real-time availability synchronization.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl p-8 transition-transform hover:-translate-y-2 border border-outline-variant/10 shadow-[0_0_40px_rgba(0,0,0,0.05)] text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-primary mb-6 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">bed</span>
                </div>
                <h3 className="text-xl font-bold font-headline mb-3 text-on-surface">Real-Time Bed Tracking</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  For administrators and staff: instant visibility into ward capacity, bed status, and patient allocation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="bg-gradient-to-r from-primary/10 to-primary-container/20 py-16 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row flex-wrap justify-between items-center gap-8 divide-y-2 md:divide-y-0 md:divide-x-2 divide-primary/20 text-center">
            <div className="flex-1 w-full pt-4 md:pt-0">
              <h4 className="text-4xl font-extrabold font-headline text-primary mb-2">10,000+</h4>
              <p className="font-semibold text-on-surface-variant tracking-wide uppercase text-sm">Patients</p>
            </div>
            <div className="flex-1 w-full pt-4 md:pt-0">
              <h4 className="text-4xl font-extrabold font-headline text-primary mb-2">500+</h4>
              <p className="font-semibold text-on-surface-variant tracking-wide uppercase text-sm">Doctors</p>
            </div>
            <div className="flex-1 w-full pt-4 md:pt-0">
              <h4 className="text-4xl font-extrabold font-headline text-primary mb-2">50+</h4>
              <p className="font-semibold text-on-surface-variant tracking-wide uppercase text-sm">Departments</p>
            </div>
            <div className="flex-1 w-full pt-4 md:pt-0">
              <h4 className="text-4xl font-extrabold font-headline text-primary mb-2">24/7</h4>
              <p className="font-semibold text-on-surface-variant tracking-wide uppercase text-sm">Support</p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-outline-variant/20 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-primary cursor-pointer">
            <span className="material-symbols-outlined text-2xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
            <span className="text-xl font-extrabold font-headline tracking-tight text-on-surface">MediSync</span>
          </div>
          
          <div className="flex gap-6 text-sm font-semibold text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>

          <div className="text-on-surface-variant text-sm">
            &copy; {new Date().getFullYear()} MediSync. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
