import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { Icon } from './Icon';

interface QnaViewProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const QnaView: React.FC<QnaViewProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Concept Explanations</h2>
      <div className="h-96 bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-y-auto flex flex-col space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-slate-500 text-center">Ask a question about the document to get started.<br/>For example: "Can you explain [concept] in simpler terms?"</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md p-3 rounded-xl shadow-sm ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800'}`}>
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="max-w-md p-3 rounded-xl bg-white shadow-sm">
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your notes..."
          className="flex-grow p-3 border-2 border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          disabled={isLoading}
          aria-label="Ask a question"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          aria-label="Send message"
        >
          <Icon name="send" className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
