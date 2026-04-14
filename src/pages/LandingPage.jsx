import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-surface font-body text-on-surface-variant selection:bg-primary-container/30 min-h-screen">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-xl shadow-purple-900/5 bg-gradient-to-b from-[#faf9fa] to-[#f4f3f4]">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
              <span className="text-2xl font-extrabold tracking-tight text-purple-700 dark:text-purple-300 font-headline">DoczNow</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a className="text-purple-700 font-bold border-b-2 border-purple-500 font-headline py-1 transition-all" href="#">Home</a>
              <a className="text-slate-500 hover:text-purple-600 transition-all font-headline py-1" href="#doctors">Doctors</a>
              <a className="text-slate-500 hover:text-purple-600 transition-all font-headline py-1" href="#facilities">Facilities</a>
              <a className="text-slate-500 hover:text-purple-600 transition-all font-headline py-1" href="#mobile">Mobile</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
              <input className="pl-10 pr-4 py-2 bg-surface-container-highest rounded-full border-none focus:ring-2 focus:ring-primary-container text-sm w-48 transition-all" placeholder="Search care..." type="text"/>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-purple-50/50 p-2 rounded-full transition-all">notifications</button>
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-purple-50/50 p-2 rounded-full transition-all">settings</button>
            <Link to="/login" className="px-6 py-2 bg-gradient-to-b from-white to-surface-container-low text-primary font-bold text-sm rounded-lg shadow-[0_4px_0_0_#cec3cc] active:shadow-none active:translate-y-[2px] border border-outline-variant/30 transition-all hover:bg-surface-bright flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">login</span>
              Login
            </Link>
          </div>
        </nav>
      </header>
      
      <main className="pt-24 pb-32">
        {/* Hero Section */}
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-xs font-semibold tracking-wider uppercase">
                <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                Trusted by 2M+ Patients
              </div>
              <h1 className="font-headline text-6xl lg:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tight">
                Experience <span className="text-primary-container">HEALTRUST</span> Care.
              </h1>
              <p className="text-lg text-on-surface-variant max-w-lg leading-relaxed">
                Precision medicine meets human connection. Our platform connects you with the world's leading specialists through AI-driven insights and 3D diagnostics.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login" className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold shadow-lg shadow-primary-container/40 hover:scale-105 active:scale-95 transition-all inline-block">
                  Book Consultation
                </Link>
                <button className="px-8 py-4 bg-surface-container-high text-primary rounded-full font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch Tour
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl shadow-purple-900/10">
                <img alt="Specialist Doctor" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRdyG3eDP_p-I6B-k0K-iJhyn6U3Hd37xGqct1DM4Smchnzfo9l2SzqcnZ9VPQDbQReo9ns32Wg8YTyFXOJQWMdZbR4NKo886cJsHThU6LgWhIH7o3XYnYo-iJW-gL6exSgyEGA75lhGM9kNayxNVOyOZ16ypewGdOaJM3gHL9n4jqCJNPkj0pKHAy1G0gZUrl8xVgaeqAWpsQUQHr5PzKTRujqvgUoYFB06DVixNpJpoloLWxAF2FkY-3-mdcpHdX6XfcI1rLf0k"/>
              </div>
              <div className="absolute -bottom-8 -left-8 p-6 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl shadow-purple-900/10 max-w-xs">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary-fixed-dim rounded-xl">
                    <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">AI Diagnosis</p>
                    <p className="text-xs text-on-surface-variant">99.8% Accuracy Rate</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section id="features" className="px-6 py-16 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
              <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary to-[#8e7494] p-10 rounded-xl shadow-xl flex flex-col justify-between text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform"></div>
                <div className="relative">
                  <span className="material-symbols-outlined text-5xl mb-6" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                  <h3 className="text-4xl font-headline font-bold mb-4">Ask AI Specialist</h3>
                  <p className="text-white/80 text-lg max-w-sm mb-8">Instant symptom analysis and health guidance powered by our advanced medical LLM.</p>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-xs font-bold tracking-widest uppercase">AI is Online</span>
                    </div>
                    <p className="italic text-sm">"Hello, I'm your DoczNow assistant. How are you feeling today?"</p>
                  </div>
                </div>
                <Link to="/login" className="relative bg-white text-primary px-8 py-3 rounded-full font-bold w-fit mt-8 hover:shadow-xl transition-all active:scale-95 block">Start Chat</Link>
              </div>

              <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <h4 className="text-2xl font-headline font-bold text-on-surface mb-2">Find Your Specialist</h4>
                  <p className="text-on-surface-variant">Over 1,200 board-certified professionals across 45 states.</p>
                </div>
                <div className="flex -space-x-4 mt-4">
                  <img alt="Doctor" className="w-12 h-12 rounded-full border-4 border-surface-container-lowest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbUhD29Wzb_Efh1WRLq33kGgPyfbvCgaTREOrjMxSJ8YMSgzHCIDAgOa4n2nbdcK9F-elKbCerblrFdOCTNCBebkX2K7wuYLpDeZqJ9qeHGwLLAbsLQhHx56AoerPAxZ-LxTEKscCaHAV3SryZroNOOUQeVYttacoVWj_KU9xqSizoRblbXzaEoWViov4eGTdxody-haHlqsNnJX0y6t60LqoUUOpZWZhpD-CgnAtNZDpNhXrm7Fxyv3tSTC7SV5AUD0e6LTffx3o"/>
                  <img alt="Doctor" className="w-12 h-12 rounded-full border-4 border-surface-container-lowest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB25PowRG4F2FwXOn5D4uYWaH04GQBZeRBFTYk53WDIrstOEmyzElVRSfHfx57122xnl1p3m6H1j3GT8yTv_915IO17sOIrr_4hReqEeGVV2ApGxjkBpFGfLJPVTZTn7t2NZzDLX5JNY3x7zpw-hZewras1Aiqg1Lnk_Z2HXU6vvru-ndx9KzVcobmbplpNRVChlGTkcEUX1GqzDJs_EDuWnfsSkGgN0PrhJT6YdSjYxkNq9t76l18hDcTmZ4Jz25A0hd5-ULTHD0s"/>
                  <img alt="Doctor" className="w-12 h-12 rounded-full border-4 border-surface-container-lowest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSDi3AqQLcLreMUsR3MZwyM9BexLJWAVezYZM_0rIze84cCNmhYC31EDSHoPFcm17UHVrP4LABv496BqfsfCMhNzb9l6X6Q_xDHEcKHYez-8AWavWgSkMCRbExgf9jf15gNUQ3hh1FRuGDPpWg3nU1VOJnq26nXvKHr82eR9tVOyYVgCMxoebQ7pQE0o3PD835SEV2pJvOMqxLM651mZKV6iDERTP0VtAmOIWcXHexdu-2D6HMHrfFxLy4Ef60H0vY77kdFa7xzJU"/>
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold border-4 border-surface-container-lowest">+1.2k</div>
                </div>
              </div>

              <div id="facilities" className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                <span className="material-symbols-outlined text-primary mb-4 text-3xl">domain</span>
                <h4 className="text-xl font-headline font-bold text-on-surface">Facilities</h4>
                <p className="text-sm text-on-surface-variant mt-2">World-class clinics in 12 major hubs.</p>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                <span className="material-symbols-outlined text-primary mb-4 text-3xl">description</span>
                <h4 className="text-xl font-headline font-bold text-on-surface">Records</h4>
                <p className="text-sm text-on-surface-variant mt-2">Secure 3D-linked medical history.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile App */}
        <section id="mobile" className="px-6 py-24 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-primary-container/20 blur-[100px] rounded-full"></div>
              <img alt="Mobile App" className="relative z-10 w-full max-w-md mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1510u8yAOqtxiDl7cuw8honqFIuy58CIf9qE0LynIE24BhRRFEIHhuNvPUbjGL3WJ7qWK39zeqlTk5asPsabgingV3l2naJzPtlKjiBPSnnoBLpcYRwyum3QIMnwC1yP6uRtIwdnr79cOcNOXEvVBqrM12UcghtYooOOC2yxKAgyS5IfzWXGbOxy0sSKzTwZUD5fCIyL37E-CTHSE1lCfhndD8PlsdoDisFyRNT73VEaxCdtKx4tbxRforT0XAPVz8W2iO95D9Qk"/>
            </div>
            <div className="flex-1 order-1 lg:order-2 space-y-8">
              <h2 className="text-5xl font-headline font-extrabold text-on-surface leading-tight">Your health in the <span className="text-primary">palm of your hand.</span></h2>
              <p className="text-lg text-on-surface-variant">Manage vitals, chat with AI, and view your 3D digital twin—all from the DoczNow mobile application. Synchronized with your clinic in real-time.</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  Real-time Biometric Tracking
                </li>
                <li className="flex items-center gap-3 font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  One-tap Emergency Response
                </li>
                <li className="flex items-center gap-3 font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  Medication Smart Reminders
                </li>
              </ul>
              <div className="flex gap-4">
                <div className="h-14 w-44 bg-on-surface rounded-xl flex items-center justify-center gap-3 text-white px-4 cursor-pointer">
                  <span className="material-symbols-outlined text-3xl">phone_iphone</span>
                  <div className="leading-tight">
                    <p className="text-[10px] uppercase font-bold text-white/60">Download on</p>
                    <p className="text-sm font-bold">App Store</p>
                  </div>
                </div>
                <div className="h-14 w-44 bg-on-surface rounded-xl flex items-center justify-center gap-3 text-white px-4 cursor-pointer">
                  <span className="material-symbols-outlined text-3xl">robot</span>
                  <div className="leading-tight">
                    <p className="text-[10px] uppercase font-bold text-white/60">Get it on</p>
                    <p className="text-sm font-bold">Play Store</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="relative py-24 bg-surface-container-highest/30">
          <div className="absolute inset-0 z-0">
            <img alt="Clinic" className="w-full h-full object-cover opacity-20 grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGDVaEaAC5HbQOde3V5N08p9f3_DfvyuWuKNp-zPwElWacyvl2F6RJIAVpxjtYXpHrORP7jnfTlzdoAz8Edx-3C-Uwd2ZRiL6gNSK6IfCO8DfwRNyDgrqhSRthjoGD9jjUQ3wLh7BjbrjVyHBYEH_PA2h_M1kABEwp3LT2J76qR5EC94OYxBI1XdyXGg4j5AO8GnovR2FjaWIbsOazuwDC04qroTGfPl6A350vOXTNUgT2vCoKmttCLGNUFRHQ1dK6yjlsu7in6NM"/>
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-headline font-bold text-on-surface">Voice of Our Patients</h2>
              <p className="text-on-surface-variant mt-4">Real stories of transformation and recovery.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  text: "The AI consultation was remarkably accurate. It flagged a cardiovascular issue that my previous tests missed. Life-changing care.",
                  author: "James Reynolds",
                  role: "Patient since 2021",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGjU55c7Tgs4bh4hR35SsjldKQb1gGDZAVio1yKhHCKD6_Zn1hzog5GG0rv3zxEx9OSjgBIO8GfkUNanVgyIvAhZGtvazeEvODUwRm3tcbGdQ-mlDehzbvLnuV0DoWpGTQZEtg-1tVRQ5XihA0jEVJDb9QRr4x3L8ZygwEq3Zn6dYpDHFgGRiMeSbH8cft5-L38djsk9V2s9pZS8VBxHt3wVR6flaEsSz9rnblXSJv0FrkOwDnBnZEHMhp02CtZCq_XbSSQm6Qzd0"
                },
                {
                  text: "Managing my family's health used to be a nightmare. DoczNow centralizes everything beautifully. The 3D charts are actually helpful!",
                  author: "Sarah Mitchell",
                  role: "Family Plan Member",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAImzYRfPlq8n3Id8G0dUelQI1f8LilyLiVMS55loF9pPb-Tb16Ty9Y_o0COAFWxp5m4JkWluu0ifF58oiz4NJ8A12QDy8lg5o-s9cFj4BnocWWnzyV2BM0lFuH0EpEw-Nsgj34BvV9X7FcCmTDc6o9qDwuellqzquILbDRTbuGQpW8hyUTLtoeGUWarB9ipqqYeJ1obO4fGV6EeyHBz4tRDQzay2yHYIY1tJ4pwbR_8wHwqlzRsudo7eBz4Q5851HXsJFesfPmY0s"
                },
                {
                  text: "The transition from online consultation to physical checkup at their facility was seamless. This is the future of medicine.",
                  author: "David Lawson",
                  role: "Specialized Care Patient",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtUfCexosHjbPeiLidOrHAcgDOwBKQR5-GVTc1cEFinIFI4J8cFlG5bMbisMb1kB1XZ0QamBb6hmgFcj-LM7ORTbAmolSnl9Ibm4U-NYI_3hfcsHsTL-g6EAzQ1-YGDjtxO3TernJUOwiVjZPTAIIdwkOj2LKotzkJwWimAOzGdajdyitaaBc54ktk85TpGHXYu5GK_PGDUPNkFRYxJChJC2xfUWEH1pfk_geKSK2gdDkAA47QujQ3KsH5j6w45NBVebAWRMIhrwI"
                }
              ].map((t, idx) => (
                <div key={idx} className="bg-white/40 backdrop-blur-xl p-8 rounded-xl border border-white/50 shadow-2xl shadow-purple-900/5">
                  <div className="flex gap-1 text-primary mb-4">
                    {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                  </div>
                  <p className="text-on-surface-variant italic mb-6 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <img alt={t.author} className="w-10 h-10 rounded-full" src={t.img}/>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{t.author}</p>
                      <p className="text-xs text-on-surface-variant">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Link to="/login" className="fixed bottom-28 right-8 z-[60] bg-primary text-white w-16 h-16 rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center group hover:scale-110 active:scale-95 transition-all">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
      </Link>

      <footer className="md:hidden fixed bottom-0 left-0 w-full rounded-t-[2rem] z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-3xl shadow-[0_-10px_40px_rgba(188,158,191,0.15)] bg-gradient-to-b from-[#faf9fa] to-[#f4f3f4]">
        <div className="fixed bottom-0 w-full flex justify-around items-end px-4 pb-6 pt-2">
          <a className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-full p-3 shadow-lg shadow-purple-300/50 -translate-y-4 scale-110 active:scale-90 transition-all duration-300" href="#">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
            <span className="font-body text-[11px] font-semibold tracking-wide">Home</span>
          </a>
          <a className="flex flex-col items-center justify-center text-slate-400 hover:text-purple-500 active:scale-90 transition-all duration-300" href="#">
            <span className="material-symbols-outlined">description</span>
            <span className="font-body text-[11px] font-semibold tracking-wide">Records</span>
          </a>
          <a className="flex flex-col items-center justify-center text-slate-400 hover:text-purple-500 active:scale-90 transition-all duration-300" href="#">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span className="font-body text-[11px] font-semibold tracking-wide">Ask AI</span>
          </a>
        </div>
      </footer>

      <footer className="hidden md:block bg-surface-container-low pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-12 pb-16 border-b border-outline-variant/20">
            <div className="col-span-1 space-y-6">
              <span className="text-3xl font-extrabold tracking-tight text-purple-700 font-headline">DoczNow</span>
              <p className="text-sm text-on-surface-variant">Advancing humanity through digital medical innovation. Secure, reliable, and patient-first.</p>
            </div>
            <div className="space-y-4">
              <h5 className="font-headline font-bold text-on-surface">Platform</h5>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors" href="#">Directory</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">3D Diagnostic</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Ask AI</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Emergency Hub</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-headline font-bold text-on-surface">Company</h5>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Facilities</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Research</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-headline font-bold text-on-surface">Contact</h5>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">mail</span> support@docznow.com</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">call</span> +1 (800) DOCZ-NOW</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">location_on</span> Silicon Valley, CA</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between items-center pt-8 text-xs text-outline font-semibold tracking-wider uppercase">
            <p>© 2026 DoczNow Healthcare Systems. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
