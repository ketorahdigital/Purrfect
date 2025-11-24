import React, { useState, useRef, useEffect } from 'react';
import { sendGuruMessage } from '../services/guruClient';
import { ChatMessage } from '../types';

const GuruChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your Purrfect Business Guru. Ask me anything about dropshipping, branding, or scaling your cat empire.", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Keep a single AbortController for the current outgoing request so we can cancel it on unmount or new sends
  const activeAbortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (activeAbortRef.current) {
        try { activeAbortRef.current.abort(); } catch (e) { /* noop */ }
      }
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isThinking) return;

    const userMsg: ChatMessage = { role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    // Cancel previous request (if any)
    if (activeAbortRef.current) {
      try { activeAbortRef.current.abort(); } catch (err) { /* ignore */ }
    }
    const controller = new AbortController();
    activeAbortRef.current = controller;

    // Add placeholder for model response
    setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

    try {
      const reply = await sendGuruMessage(text, { timeoutMs: 30000, signal: controller.signal as any });

      if (!mountedRef.current) return;

      setMessages(prev => {
        const msgs = prev.map(m => ({ ...m }));
        const idx = msgs.findIndex(m => m.role === 'model' && (!m.text || m.text === ''));
        if (idx !== -1) {
          msgs[idx].text = reply;
          msgs[idx].timestamp = new Date();
        } else {
          msgs.push({ role: 'model', text: reply, timestamp: new Date() });
        }
        return msgs;
      });
    } catch (error: any) {
      if (!mountedRef.current) return;
      const messageText = error?.message ?? 'Unknown error';
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${messageText}`, timestamp: new Date(), isError: true }]);
      console.error('sendGuruMessage error', error);
    } finally {
      setIsThinking(false);
      activeAbortRef.current = null;
    }
  };

  return (
    <div className="h-[600px] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-cat-200">
      {/* Header */}
      <div className="bg-cat-800 p-6 text-white flex items-center space-x-4">
        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-2xl shadow-inner" aria-hidden>
          🧙‍♂️
        </div>
        <div>
          <h2 className="text-xl font-bold">Guru Chat</h2>
          <p className="text-cat-200 text-sm">Expert business advice 24/7</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-cat-50" role="log" aria-live="polite">
        {messages.map((msg, index) => (
          <div key={`${msg.timestamp?.getTime ? msg.timestamp.getTime() : index}-${index}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user'
                ? 'bg-accent text-cat-900 rounded-tr-none'
                : msg.isError
                  ? 'bg-red-100 text-red-800 rounded-tl-none'
                  : 'bg-white text-cat-800 rounded-tl-none border border-cat-100'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              <span className="text-xs opacity-50 mt-2 block text-right" aria-hidden>
                {msg.timestamp?.toLocaleTimeString ? msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
              </span>
            </div>
          </div>
        ))}
        {isThinking && (
           <div className="flex justify-start" aria-hidden>
             <div className="bg-white text-cat-500 rounded-2xl rounded-tl-none p-4 border border-cat-100 shadow-sm">
               <div className="flex space-x-2">
                 <div className="w-2 h-2 bg-cat-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-cat-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-cat-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-cat-100" aria-label="Send message form">
        <div className="flex items-center space-x-3">
          <input
            id="guru-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask for advice (e.g., 'How do I market catnip?')"
            className="flex-1 bg-cat-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent focus:outline-none text-cat-800"
            disabled={isThinking}
            aria-label="Ask the business guru"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isThinking || !inputValue.trim()}
            className="bg-cat-800 hover:bg-cat-700 text-white p-3 rounded-xl transition disabled:opacity-50"
            aria-label="Send message"
            title="Send"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuruChat;
