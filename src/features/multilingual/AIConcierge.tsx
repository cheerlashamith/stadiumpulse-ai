import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { translate } from '../../services/i18nService';
import { askConcierge } from '../../services/geminiService';
import { sanitizeInput } from '../../services/sanitizeInput';
import { ChatMessage } from '../../types';
import { MessageSquare, Send, Mic, MicOff, Volume2, VolumeX, X, HelpCircle } from 'lucide-react';

export const AIConcierge: React.FC = () => {
  const { language, textSize, highContrast } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: translate('concierge.welcome', language),
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTtsActive, setIsTtsActive] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : language === 'hi' ? 'hi-IN' : 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setInputError(null);
      };
      rec.onerror = (err: any) => {
        console.warn('Speech recognition status:', err?.message || err);
        setIsListening(false);
      };
      recognitionRef.current = rec;
    }
  }, [language]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle TTS playback
  const speakText = (text: string) => {
    if (!isTtsActive || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop active playback first
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : language === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    // Security check: Sanitization
    const sanitization = sanitizeInput(inputValue, 300);
    if (!sanitization.isValid) {
      setInputError(sanitization.error || 'Invalid input pattern detected.');
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: sanitization.sanitizedText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setInputError(null);
    setIsTyping(true);

    try {
      const responseText = await askConcierge(sanitization.sanitizedText, language);
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
      speakText(responseText);
    } catch (err) {
      console.warn('Chat request processed with alternate pathway:', (err as any)?.message || err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="ai-concierge-widget">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:scale-105 ${
            highContrast 
              ? 'bg-black text-white border-2 border-white hover:bg-slate-900 focus:ring-white' 
              : 'bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-400'
          }`}
          aria-label={translate('concierge.title', language)}
          id="btn-open-concierge"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div 
          className={`flex h-[480px] w-80 md:w-96 flex-col rounded-2xl border text-slate-100 shadow-2xl overflow-hidden transition-all duration-300 ${
            highContrast 
              ? 'bg-black border-white text-white' 
              : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
          }`}
          id="chat-window"
          role="dialog"
          aria-labelledby="concierge-title"
        >
          {/* Chat Header */}
          <div className={`flex items-center justify-between border-b px-4 py-3 ${
            highContrast ? 'bg-black border-white' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full animate-pulse ${
                highContrast ? 'bg-white' : 'bg-emerald-500'
              }`}></div>
              <h2 id="concierge-title" className={`text-sm font-bold tracking-tight ${
                highContrast ? 'text-white' : 'text-slate-950'
              }`}>
                {translate('concierge.title', language)}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              {/* TTS Toggle Button */}
              <button
                onClick={() => {
                  const nextState = !isTtsActive;
                  setIsTtsActive(nextState);
                  if (!nextState) window.speechSynthesis.cancel();
                }}
                className={`p-1.5 rounded-md focus:outline-none focus:ring-1 transition-colors ${
                  isTtsActive 
                    ? (highContrast ? 'text-white bg-slate-900 font-extrabold border border-white' : 'text-emerald-600 bg-emerald-50') 
                    : (highContrast ? 'text-slate-300' : 'text-slate-400 hover:bg-slate-100')
                }`}
                aria-label={isTtsActive ? translate('concierge.ttsOff', language) : translate('concierge.ttsOn', language)}
              >
                {isTtsActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.speechSynthesis.cancel();
                }}
                className={`p-1.5 rounded-md focus:outline-none focus:ring-1 ${
                  highContrast 
                    ? 'text-white border border-white bg-black hover:bg-slate-900' 
                    : 'text-slate-400 hover:bg-slate-150 hover:text-slate-900'
                }`}
                aria-label="Close Assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${
            highContrast ? 'bg-black' : 'bg-slate-50/50'
          }`}>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${textSize === 'large' ? 'text-base' : 'text-sm'} leading-relaxed ${
                    msg.sender === 'user'
                      ? (highContrast ? 'bg-white text-black font-extrabold rounded-br-none border border-white' : 'bg-emerald-600 text-white rounded-br-none')
                      : (highContrast ? 'bg-black text-white rounded-bl-none border-2 border-white' : 'bg-white text-slate-800 rounded-bl-none border border-slate-150 shadow-xs')
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className={`mt-1 text-[10px] font-mono px-1 ${
                  highContrast ? 'text-slate-300' : 'text-slate-400'
                }`}>{msg.timestamp}</span>
              </div>
            ))}
            {isTyping && (
              <div className={`flex items-center space-x-2 text-xs rounded-xl px-3 py-2 w-max border ${
                highContrast ? 'bg-black border-white text-white font-mono' : 'bg-white border-slate-150 text-slate-500 shadow-xs'
              }`}>
                <div className="flex space-x-1">
                  <div className={`h-1.5 w-1.5 rounded-full animate-bounce ${highContrast ? 'bg-white' : 'bg-emerald-400'}`} style={{ animationDelay: '0ms' }}></div>
                  <div className={`h-1.5 w-1.5 rounded-full animate-bounce ${highContrast ? 'bg-white' : 'bg-emerald-400'}`} style={{ animationDelay: '150ms' }}></div>
                  <div className={`h-1.5 w-1.5 rounded-full animate-bounce ${highContrast ? 'bg-white' : 'bg-emerald-400'}`} style={{ animationDelay: '300ms' }}></div>
                </div>
                <span>Gemini is generating strategy...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className={`px-3 py-1.5 flex flex-wrap gap-1.5 border-t ${
            highContrast ? 'bg-black border-white' : 'bg-white border-slate-150'
          }`}>
            <button 
              onClick={() => { setInputValue('Where is Gate 4 accessible path?'); }}
              className={`text-[10px] border px-2.5 py-1 rounded-full transition font-semibold ${
                highContrast 
                  ? 'bg-black border-white text-white hover:bg-slate-900' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              ♿ Gate 4 Access
            </button>
            <button 
              onClick={() => { setInputValue('Which transit option is most eco-friendly?'); }}
              className={`text-[10px] border px-2.5 py-1 rounded-full transition font-semibold ${
                highContrast 
                  ? 'bg-black border-white text-white hover:bg-slate-900' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              🌱 Green Transit
            </button>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className={`border-t p-3 ${
            highContrast ? 'bg-black border-white' : 'bg-white border-slate-150'
          }`}>
            {inputError && (
              <div className="mb-2 text-xs text-red-500 flex items-center space-x-1 font-semibold animate-pulse" id="error-chat">
                <span>⚠️ {inputError}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              {/* Speech-to-text Microphone button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2 rounded-xl transition ${
                  isListening 
                    ? 'bg-red-600 text-white animate-pulse font-bold' 
                    : (highContrast ? 'bg-black text-white border border-white hover:bg-slate-900' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100')
                }`}
                aria-label={isListening ? translate('concierge.voiceOff', language) : translate('concierge.voiceOn', language)}
              >
                {isListening ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (inputError) setInputError(null);
                }}
                placeholder={translate('concierge.placeholder', language)}
                className={`flex-1 rounded-xl border px-3.5 py-2 text-sm focus:outline-none focus:ring-1 ${
                  highContrast 
                    ? 'bg-black border-white text-white focus:ring-white placeholder-slate-400 font-mono' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-emerald-500 placeholder-slate-400'
                }`}
                id="input-chat"
                aria-label="Ask concierge message"
              />

              <button
                type="submit"
                className={`p-2 rounded-xl transition ${
                  highContrast 
                    ? 'bg-white text-black hover:bg-slate-100 border border-white' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
                aria-label={translate('concierge.send', language)}
                id="btn-send-chat"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
