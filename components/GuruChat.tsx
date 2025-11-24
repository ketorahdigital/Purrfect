import React, { useState, useRef, useEffect } from 'react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { createGuruChat } from '../services/geminiService';
import { ChatMessage } from '../types';

const GuruChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your Purrfect Business Guru. Ask me anything about dropshipping, branding, or scaling your cat empire.", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session once
  useEffect(() => {
    try {
      chatSessionRef.current = createGuruChat();
    } catch (e) {
      console.error("Failed to init chat", e);
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      // Streaming response for better UX
      const resultStream = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullText = '';
      // Add placeholder message for stream updates
      const botMsgId = Date.now().toString();
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

      for await (const chunk of resultStream) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
            fullText += chunkText;
            setMessages(prev => {
                const newMsgs = [...prev];
                const lastMsg = newMsgs[newMsgs.length - 1];
                if (lastMsg.role === 'model') {
                    lastMsg.text = fullText;
                }
                return newMsgs;
            });
        }
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'model', text: "Oops! I coughed up a fur ball (Encountered an error). Check your API Key.", timestamp: new Date(), isError: true }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="h-[600px] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-cat-200">
      {/* Header */}
      <div className="bg-cat-800 p-6 text-white flex items-center space-x-4">
        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-2xl shadow-inner">
          🧙‍♂️
        </div>
        <div>
          <h2 className="text-xl font-bold">Guru Chat</h2>
          <p className="text-cat-200 text-sm">Expert business advice 24/7</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-cat-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-accent text-cat-900 rounded-tr-none' 
                : msg.isError 
                  ? 'bg-red-100 text-red-800 rounded-tl-none' 
                  : 'bg-white text-cat-800 rounded-tl-none border border-cat-100'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              <span className="text-xs opacity-50 mt-2 block text-right">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        {isThinking && (
           <div className="flex justify-start">
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
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-cat-100">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask for advice (e.g., 'How do I market catnip?')"
            className="flex-1 bg-cat-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent focus:outline-none text-cat-800"
            disabled={isThinking}
          />
          <button 
            type="submit" 
            disabled={isThinking || !inputValue.trim()}
            className="bg-cat-800 hover:bg-cat-700 text-white p-3 rounded-xl transition disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuruChat;