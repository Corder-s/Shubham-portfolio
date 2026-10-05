import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Loader2,
  Trash2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Minus,
  Maximize2,
} from 'lucide-react';
import { aiAgentService, DEFAULT_SUGGESTED_QUESTIONS } from '../../services/aiAgentService';
import { AIAgentMessage, AIAgentAction, SiteSettings } from '../../types';
import { AppBrandIcon } from '../Social/AppBrandIcon';

interface AIAgentChatProps {
  settings?: SiteSettings;
}

export const AIAgentChat: React.FC<AIAgentChatProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const assistantName = settings?.ai_assistant_name || 'Ask Shubham';
  const welcomeText =
    settings?.ai_welcome_message ||
    "Hi! I'm Shubham's AI portfolio assistant. Ask me anything about his projects, skills, education, achievements, experience, or how to contact him.";
  const suggestedQuestions =
    settings?.ai_suggested_questions && settings.ai_suggested_questions.length > 0
      ? settings.ai_suggested_questions
      : DEFAULT_SUGGESTED_QUESTIONS;

  const [messages, setMessages] = useState<AIAgentMessage[]>(() => {
    const saved = aiAgentService.getStoredMessages();
    if (saved.length > 0) {
      return saved;
    }
    const initialGreeting: AIAgentMessage = {
      id: 'msg-welcome',
      sender: 'assistant',
      content: welcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    aiAgentService.saveMessages([initialGreeting]);
    return [initialGreeting];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, loading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, isMinimized]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    const userMsg: AIAgentMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    aiAgentService.saveMessages(newMessages);
    setInputText('');
    setLoading(true);

    try {
      const res = await aiAgentService.sendMessage(query, newMessages);
      const assistantMsg: AIAgentMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: res.response,
        actions: res.actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updated = [...newMessages, assistantMsg];
      setMessages(updated);
      aiAgentService.saveMessages(updated);
    } catch {
      const errorMsg: AIAgentMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        content: 'I had trouble connecting right now. Please feel free to explore Shubham’s projects or reach out directly!',
        actions: [
          { label: 'View Projects', action: 'scroll', target: '#projects' },
          { label: 'Contact Shubham', action: 'scroll', target: '#contact' },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const updated = [...newMessages, errorMsg];
      setMessages(updated);
      aiAgentService.saveMessages(updated);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: AIAgentAction) => {
    if (action.action === 'scroll') {
      const element = document.querySelector(action.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action.action === 'external' && action.target) {
      window.open(action.target, '_blank', 'noopener,noreferrer');
    }
  };

  const handleClearHistory = () => {
    aiAgentService.clearHistory();
    const initialGreeting: AIAgentMessage = {
      id: `msg-welcome-${Date.now()}`,
      sender: 'assistant',
      content: welcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialGreeting]);
    aiAgentService.saveMessages([initialGreeting]);
  };

  const formatMessageText = (content: string) => {
    // Basic Markdown helper for bold text, bullet points, and code
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold rendering
      let formatted: React.ReactNode = line;
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        formatted = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="text-[#02F74C] font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });
      }

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={idx} className="flex items-start gap-1.5 pl-1 my-1">
            <span className="text-[#02F74C] shrink-0">•</span>
            <span>{formatted}</span>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="leading-relaxed">
          {formatted}
        </p>
      );
    });
  };

  if (settings && settings.ai_enabled === false) {
    return null;
  }

  return (
    <div className="fixed z-50 font-mono select-none">
      {/* Floating Chat Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className={`fixed right-3 sm:right-6 bottom-20 sm:bottom-24 w-[calc(100vw-1.5rem)] sm:w-[410px] max-w-[430px] bg-[#0A0D0C]/95 backdrop-blur-xl border border-[#02F74C]/50 shadow-[0_0_35px_rgba(2,247,76,0.25)] rounded-xl overflow-hidden flex flex-col z-50 ${
              isMinimized ? 'h-14' : 'h-[520px] max-h-[82vh]'
            }`}
          >
            {/* Terminal Header */}
            <div className="px-4 py-3 bg-[#020203] border-b border-[#02F74C]/25 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#02F74C]/10 border border-[#02F74C]/40 flex items-center justify-center text-[#02F74C] shadow-[0_0_10px_rgba(2,247,76,0.3)]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white tracking-wider">
                      {assistantName}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#02F74C]/20 text-[#02F74C] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#02F74C] animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                  <p className="text-[10px] text-[#A6A9AA]">AI Portfolio Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#A6A9AA]">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="p-1.5 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors cursor-pointer"
                  title="Clear conversation history"
                  aria-label="Clear chat history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:text-[#02F74C] hover:bg-[#02F74C]/10 rounded transition-colors cursor-pointer"
                  title={isMinimized ? 'Expand window' : 'Minimize window'}
                  aria-label={isMinimized ? 'Expand assistant' : 'Minimize assistant'}
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:text-white hover:bg-[#02F74C]/15 rounded transition-colors cursor-pointer"
                  title="Close assistant"
                  aria-label="Close AI portfolio assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body (Hidden when minimized) */}
            {!isMinimized && (
              <>
                <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs text-[#F3F3F4]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      {/* Avatar / Sender Marker */}
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#76A988]">
                        {msg.sender === 'assistant' ? (
                          <>
                            <span className="text-[#02F74C] font-bold">&lt;AI /&gt;</span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </>
                        ) : (
                          <>
                            <span>YOU</span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </>
                        )}
                      </div>

                      {/* Bubble Container */}
                      <div
                        className={`max-w-[88%] p-3 rounded-lg leading-relaxed select-text ${
                          msg.sender === 'user'
                            ? 'bg-[#02F74C]/15 border border-[#02F74C]/50 text-white rounded-br-none shadow-[0_0_12px_rgba(2,247,76,0.1)]'
                            : 'bg-[#020203] border border-[#02F74C]/25 text-[#E2E8F0] rounded-bl-none shadow-[0_0_15px_rgba(2,247,76,0.06)]'
                        }`}
                      >
                        {formatMessageText(msg.content)}

                        {/* Interactive Context Action Buttons */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-[#02F74C]/20 flex flex-wrap gap-1.5">
                            {msg.actions.map((act, aIdx) => (
                              <button
                                key={aIdx}
                                type="button"
                                onClick={() => handleActionClick(act)}
                                className="px-2.5 py-1 bg-[#0A0D0C] hover:bg-[#02F74C] text-[#02F74C] hover:text-[#020203] border border-[#02F74C]/40 text-[10px] font-bold uppercase rounded transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_8px_rgba(2,247,76,0.2)]"
                              >
                                {act.label.toLowerCase().includes('github') && (
                                  <AppBrandIcon platform="github" size="xs" variant="app-tile" />
                                )}
                                {act.label.toLowerCase().includes('linkedin') && (
                                  <AppBrandIcon platform="linkedin" size="xs" variant="app-tile" />
                                )}
                                {act.label.toLowerCase().includes('contact') && (
                                  <AppBrandIcon platform="whatsapp" size="xs" variant="app-tile" />
                                )}
                                <span>[ {act.label} ]</span>
                                {act.action === 'external' ? (
                                  <ExternalLink className="w-2.5 h-2.5" />
                                ) : (
                                  <ArrowRight className="w-2.5 h-2.5" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Thinking Indicator */}
                  {loading && (
                    <div className="flex flex-col items-start">
                      <div className="text-[10px] text-[#76A988] mb-1">&lt;AI /&gt; • ANALYZING</div>
                      <div className="p-3 bg-[#020203] border border-[#02F74C]/30 text-[#02F74C] rounded-lg rounded-bl-none flex items-center gap-2 shadow-[0_0_12px_rgba(2,247,76,0.15)]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="text-[11px] animate-pulse">Reading portfolio context...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions Carousel */}
                <div className="px-3 py-2 bg-[#020203]/70 border-t border-[#02F74C]/15">
                  <div className="text-[9px] text-[#76A988] uppercase mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#02F74C]" />
                    <span>SUGGESTED_PROMPTS:</span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {suggestedQuestions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => handleSend(q)}
                        disabled={loading}
                        className="px-2.5 py-1 bg-[#0A0D0C] hover:bg-[#02F74C]/15 border border-[#02F74C]/30 hover:border-[#02F74C] text-[#02F74C] text-[10px] whitespace-nowrap rounded transition-all cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="p-3 bg-[#020203] border-t border-[#02F74C]/25 flex items-center gap-2"
                >
                  <label htmlFor="ai-chat-input" className="sr-only">
                    Ask Shubham&apos;s AI Assistant
                  </label>
                  <input
                    id="ai-chat-input"
                    ref={inputRef}
                    type="text"
                    maxLength={2000}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about skills, Snapgram, education, contact..."
                    disabled={loading}
                    className="flex-1 px-3 py-2 bg-[#0A0D0C] border border-[#02F74C]/30 text-white placeholder-[#76A988]/50 text-base sm:text-xs rounded-lg focus:outline-none focus:border-[#02F74C] focus:shadow-[0_0_12px_rgba(2,247,76,0.3)] disabled:opacity-50 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || loading}
                    aria-label="Send message to AI assistant"
                    className="p-2.5 bg-[#02F74C] hover:bg-[#02F74C]/90 text-[#020203] rounded-lg transition-all shadow-[0_0_12px_rgba(2,247,76,0.35)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI Agent Trigger Button */}
      <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 flex items-center gap-2">
        {!isOpen && hovered && (
          <div
            role="tooltip"
            className="border border-[#02F74C] bg-[#0A0D0C] text-[#02F74C] px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(2,247,76,0.3)] animate-in fade-in duration-150 rounded"
          >
            &lt; ASK_SHUBHAM_AI /&gt;
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Open AI portfolio assistant"
          aria-expanded={isOpen}
          className={`w-14 h-14 rounded-full border bg-[#0A0D0C] flex flex-col items-center justify-center transition-all cursor-pointer group ${
            isOpen
              ? 'border-[#02F74C] text-[#020203] bg-[#02F74C] shadow-[0_0_30px_rgba(2,247,76,0.8)] scale-105'
              : 'border-[#02F74C] text-[#02F74C] shadow-[0_0_20px_rgba(2,247,76,0.35)] hover:shadow-[0_0_35px_rgba(2,247,76,0.7)] hover:scale-110'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 stroke-[2.5]" />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Bot className="w-5 h-5 text-[#02F74C] group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold tracking-tighter text-[#02F74C] mt-0.5">
                AI
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
