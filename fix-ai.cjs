const fs = require('fs');

const code = `import React, { useState, useRef, useEffect, memo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import logger from '../../utils/logger';

/**
 * MessageItem Component wrapped in React.memo for performance optimization
 * @component
 */
const MessageItem = memo(({ msg, userProfile }) => {
  return (
    <div className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in\`}>
      <div className={\`flex gap-5 max-w-[90%] md:max-w-[80%] \${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}\`}>
        
        {/* Avatar / Identity Icon */}
        <div className={\`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg transition-transform hover:scale-110 \${msg.role === 'user' ? 'bg-surface-container-high' : 'bg-primary text-white'}\`}>
          {msg.role === 'user' ? (
            <img 
              className="w-full h-full object-cover rounded-2xl" 
              src={userProfile?.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAwfI3BpPZZmY1N3tcehtrjKSKIf1Xkkkpi9jZJyB-W3q6gR2bPOw-CMgIA1uz24qxl3V-5zoz2z_T-WCp90dSrqHm9DheCqZDTkItCwPUnzbFexOXFJ16XllIY2zXsrZnGSaxHn2JQ5fQPoTIrEmC32PcXnfTsBby7Lw9YcRIw-xeNafycMF21Hf_22S5Rj-k8XQlFUEIlEzPFTy9SfYiOkH2ffa0f88nUFanmaIKQC9tPsqfvulYeUHoIOFhEYLVEQ5abLwD6cQw"} 
              alt="User profile picture" 
            />
          ) : (
            <span className="material-symbols-outlined text-2xl" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col gap-2">
          {msg.isAssessment ? (
            <div className="bg-white border-l-8 border-primary rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 transition-all hover:shadow-primary/10">
              <div className="p-8 space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="font-headline font-black text-2xl text-on-surface tracking-tighter leading-none mb-2">Preliminary Assessment</h3>
                    <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Clinical Identity Triage Phase 1</p>
                  </div>
                  <div className={\`px-5 py-2 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 border \${
                    (msg.urgency || 'MEDIUM') === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-orange-50 text-orange-700 border-orange-100'
                  }\`}>
                    <span aria-hidden="true" className={\`w-2 h-2 rounded-full animate-pulse \${
                      (msg.urgency || 'MEDIUM') === 'HIGH' ? 'bg-rose-600' : 'bg-orange-600'
                    }\`}></span>
                    {msg.urgency || 'MEDIUM'} URGENCY
                  </div>
                </div>

                <div className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/5">
                  <p className="text-on-surface leading-relaxed text-sm font-medium" aria-live="polite">{msg.content}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-[0.2em]">Diagnostic Vectors</h4>
                    <ul className="space-y-3" aria-label="Possible conditions">
                      {(msg.conditions || ['Consultation Required']).map((c, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs font-black text-on-surface uppercase tracking-tight">
                          <span className="material-symbols-outlined text-primary text-lg" aria-hidden="true">medical_information</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-[0.2em]">Clinical Redirection</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                        {msg.department || 'General Medicine'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest italic">Proceed to professional validation?</p>
                  <Link to="/patient/book-appointment" aria-label="Book an appointment with a doctor" className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-95 transition-all text-center">
                    Synchronize Appointment
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className={\`p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm \${
              msg.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white text-on-surface border border-outline-variant/10 rounded-tl-none'
            }\`}>
              {msg.content}
            </div>
          )}
          <span className={\`text-[9px] font-black uppercase tracking-tighter opacity-30 \${msg.role === 'user' ? 'text-right' : 'text-left'}\`}>
            {msg.role === 'user' ? 'Transmission Verified' : 'AI Response Core 1.0'} • Just Now
          </span>
        </div>
      </div>
    </div>
  );
});

/**
 * AISymptomChecker Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function AISymptomChecker() {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: \`Hello\${userProfile?.full_name ? ' ' + userProfile.full_name : ''}! I am your MediSync triage assistant. Please describe your symptoms in detail so I can help guide you to the right care.\`,
      isInitial: true
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000); // 15s timeout limit

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API key is missing.");
      }

      const promptText = \`You are an AI Symptom Checker. Analyze the following symptoms: "\${input}". 
Respond ONLY with a valid JSON object matching this schema: 
{ 
  "content": "A brief compassionate response and summary", 
  "urgency": "HIGH", "MEDIUM", or "LOW", 
  "conditions": ["Possible condition 1", "Possible condition 2"], 
  "department": "Recommended hospital department (e.g. Cardiology, General Medicine)" 
}\`;

      const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${apiKey}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('API Error');
      }

      const rawData = await response.json();
      let textResponse = rawData.candidates[0].content.parts[0].text;
      
      // Parse structured JSON
      let aiData = {};
      try {
        // Strip markdown code block markers if Gemini included them
        const jsonStr = textResponse.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        aiData = JSON.parse(jsonStr);
      } catch (err) {
        throw new Error('Failed to parse structured JSON from AI.');
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiData.content || "Assessment complete. See details below.",
        isAssessment: true,
        urgency: aiData.urgency || 'MEDIUM',
        conditions: aiData.conditions || [],
        department: aiData.department || 'General Medicine'
      }]);

    } catch (error) {
      logger.warn("AI Service error or timeout:", error);
      
      let errorMsg = "There was a problem connecting to the triage neural engine. Please try again or seek manual assistance.";
      if (error.name === 'AbortError') {
        errorMsg = "The AI service is taking too long to respond. Please try again.";
      }

      // Fallback response simulating structured output for UX continuity during failures
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMsg,
        isAssessment: true,
        urgency: 'MEDIUM',
        conditions: ['System Timeout', 'Manual Evaluation Required'],
        department: 'General Triage'
      }]);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleSuggestion = (symptom) => {
    setInput(symptom);
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased flex flex-col h-screen relative overflow-hidden">
      {/* Emergency Disclaimer */}
      <div 
        role="alert" 
        aria-live="assertive" 
        className="fixed top-0 left-0 md:left-64 right-0 z-40 bg-rose-50 border-b border-rose-100 px-6 py-2.5 flex items-center justify-center gap-3"
      >
        <span className="material-symbols-outlined text-rose-600 scale-90" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
        <p className="text-[10px] md:text-xs font-black text-rose-800 uppercase tracking-widest text-center">
          FOR MEDICAL EMERGENCIES, PLEASE CALL <span className="underline">102</span> OR GO TO THE NEAREST ER. THIS IS AN AI GUIDANCE SYSTEM.
        </p>
      </div>

      <main className="flex-1 overflow-y-auto pt-20 pb-48 px-4 md:px-8 custom-scrollbar" aria-label="Chat messages">
        <div className="max-w-4xl mx-auto flex flex-col gap-10 py-8">
          
          {messages.map((msg, idx) => (
            <MessageItem key={idx} msg={msg} userProfile={userProfile} />
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in" aria-live="polite" aria-busy="true">
              <div className="flex gap-5 items-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                </div>
                <div className="px-6 py-4 rounded-3xl bg-surface-container-low border border-outline-variant/5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Protocols */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 z-50 bg-white/60 backdrop-blur-3xl px-6 py-8 md:py-10 border-t border-outline-variant/10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Quick Suggestion Registry */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar" aria-label="Symptom suggestions">
            {['Acute Headache', 'Fever Registry', 'Digestive Distress', 'Respiratory Congestion', 'Joint Inflammation'].map(s => (
              <button 
                key={s}
                onClick={() => handleSuggestion(s)}
                aria-label={\`Suggest \${s}\`}
                className="whitespace-nowrap px-5 py-2.5 bg-surface-container-low rounded-full text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 hover:bg-primary/5 hover:text-primary border border-outline-variant/10 transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Secure Input Bar */}
          <form onSubmit={handleSend} className="relative flex items-center group">
            <div className="absolute left-6 text-on-surface-variant/20 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined" aria-hidden="true">health_metrics</span>
            </div>
            <input 
              aria-label="Describe your symptoms"
              className="w-full bg-surface-container-low border-none rounded-[2rem] h-16 pl-16 pr-32 text-sm font-black text-on-surface placeholder-on-surface-variant/20 focus:ring-4 focus:ring-primary/5 transition-all" 
              placeholder="Describe symptomatic vectors for analysis..." 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <div className="absolute right-3 flex items-center gap-2">
              <button 
                type="submit"
                aria-label="Send symptoms for analysis"
                disabled={loading || !input.trim()}
                className="w-12 h-12 bg-primary text-white rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-95 disabled:opacity-20 transition-all"
              >
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontVariationSettings: "'wght' 600" }}>arrow_upward</span>
              </button>
            </div>
          </form>
          <p className="text-[9px] text-center text-on-surface-variant/30 font-black uppercase tracking-[0.2em]">
            MediSync Neural Engine • Guidance Only • Privacy Guard Active
          </p>
        </div>
      </div>

      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[50%] h-[50%] bg-secondary-container/20 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/patient/AISymptomChecker.jsx', code);
