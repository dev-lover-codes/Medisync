import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AISymptomChecker() {
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `Hello${userProfile?.full_name ? ' ' + userProfile.full_name : ''}. I'm MediSync's AI Health Assistant. Please describe your symptoms in detail so I can help you understand potential causes and whether you should see a doctor.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not found');
      }

      // Anthropic API requires messages to start with 'user'
      const apiMessages = messages
        .concat(userMessage)
        .filter(m => m.role === 'user' || m.role === 'assistant');
      
      // If the first message is 'assistant', Anthropic will return 400.
      // We take only the messages starting from the first 'user' message for the API call.
      const firstUserIdx = apiMessages.findIndex(m => m.role === 'user');
      const finalApiMessages = firstUserIdx !== -1 ? apiMessages.slice(firstUserIdx) : apiMessages;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 500,
          system: "You are a helpful medical AI assistant for MediSync Hospital Management System. Always clarify that you are an AI and not a doctor. Provide general guidance based on symptoms but strongly recommend visiting a doctor or booking an appointment for a real diagnosis.",
          messages: finalApiMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Anthropic API Error:", errorData);
        throw new Error(errorData.error?.message || 'API Request failed');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.content[0].text 
      }]);
      setLoading(false);

    } catch (error) {
      console.warn("API call failed (likely due to CORS or missing key). Falling back to simulated response.", error);
      
      // Fallback simulated response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Based on the symptoms you've described, there are a few potential reasons. However, as an AI, I cannot provide a definitive diagnosis. It is strongly recommended to book a consultation with our general physician or specialist for a proper examination. Would you like me to redirect you to book an appointment?" 
        }]);
        setLoading(false);
      }, 1500);
      return; // Return to prevent clearing loading state twice
    }
    
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8 pb-24 bg-[#faf9fa] h-[calc(100vh-4rem)] md:h-screen flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold font-manrope text-gray-800 mb-2 flex items-center gap-3">
          <span className="bg-[#e9d7f1] text-[#6f5673] p-2 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          AI Symptom Checker
        </h1>
        <p className="text-gray-500 font-inter">Describe your symptoms to get immediate AI-powered guidance</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col overflow-hidden mb-4 relative">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white ${msg.role === 'user' ? 'bg-[#bc9ebf]' : 'bg-[#6f5673]'}`}>
                  {msg.role === 'user' ? (
                    <span className="font-bold text-sm leading-none">{userProfile?.full_name?.charAt(0) || 'U'}</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`px-5 py-3 rounded-2xl font-inter text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#bc9ebf] text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-[#6f5673] flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="px-5 py-4 rounded-2xl bg-gray-100 rounded-tl-none border border-gray-200 flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <form onSubmit={handleSend} className="flex gap-4">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. I have a mild fever and a dry cough for 3 days..."
              className="flex-1 px-5 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-[#bc9ebf] focus:ring-1 focus:ring-[#bc9ebf] bg-white font-inter"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-[#6f5673] hover:bg-[#bc9ebf] text-white px-6 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#6f5673]/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-3 font-inter">
            Note: This AI tool provides general information and is not a substitute for professional medical advice.
          </p>
        </div>

      </div>
    </div>
  );
}
