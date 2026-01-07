
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from './components/Layout';
import { MessageItem } from './components/MessageItem';
import { Message, MessageRole, StructuredResponse } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await geminiService.generateStructuredResponse(input.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.ASSISTANT,
        content: result,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.ASSISTANT,
        content: {
          plan: ["Operation Aborted"],
          execution: "I encountered an error while processing your request. This is likely due to API constraints or connectivity issues.",
          verification: "Self-correction: API response was not received as expected."
        },
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const SidebarContent = (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center space-x-3 mb-12">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white leading-tight">Nexus AI</h1>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Executive Terminal</p>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Framework</h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <div className="w-1 h-1 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p className="text-xs font-semibold text-zinc-300">Plan</p>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Task decomposition and strategic initialization.</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2"></div>
              <div>
                <p className="text-xs font-semibold text-zinc-300">Execute</p>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Nuanced, high-density professional output.</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-1 h-1 rounded-full bg-amber-500 mt-2"></div>
              <div>
                <p className="text-xs font-semibold text-zinc-300">Verify</p>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Critical self-audit and limitation transparency.</p>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Parameters</h3>
          <div className="space-y-3">
             <div className="flex justify-between items-center bg-zinc-800/30 p-2 rounded-md border border-zinc-800">
               <span className="text-[10px] text-zinc-400">Model</span>
               <span className="text-[10px] mono text-blue-400">Gemini 3 Pro</span>
             </div>
             <div className="flex justify-between items-center bg-zinc-800/30 p-2 rounded-md border border-zinc-800">
               <span className="text-[10px] text-zinc-400">Thinking</span>
               <span className="text-[10px] mono text-emerald-400">Active</span>
             </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-800">
        <button className="w-full flex items-center justify-center space-x-2 py-2.5 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 text-xs font-medium rounded-lg transition-colors" onClick={() => setMessages([])}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <Layout sidebar={SidebarContent}>
      {/* Messages Header */}
      <div className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-medium text-zinc-400 tracking-wide">Secure Connection Established</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-[10px] mono text-zinc-600">ID: NX-{Date.now().toString().slice(-4)}</div>
          <div className="flex items-center space-x-1">
             <span className="text-[10px] text-zinc-500">Latency:</span>
             <span className="text-[10px] mono text-emerald-500">240ms</span>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto pt-12 pb-32">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800 shadow-2xl">
              <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">Initialize New Directives</h2>
            <p className="text-zinc-500 leading-relaxed mb-8">
              Welcome to the Nexus Executive interface. Please provide your complex objective. I will decompose it using the Plan-Execute-Verify framework.
            </p>
            <div className="grid grid-cols-2 gap-4 w-full">
              {['Market Analysis Strategy', 'Technical Architecture Review', 'Executive Brief Generation', 'Risk Assessment Matrix'].map((item) => (
                <button 
                  key={item}
                  onClick={() => setInput(item)}
                  className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl text-left hover:border-zinc-700 hover:bg-zinc-900 transition-all group"
                >
                  <p className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200">{item}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {messages.map((msg) => (
              <MessageItem key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="px-4 mb-12">
                <div className="flex flex-col space-y-4 animate-pulse max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Formulating Strategic Plan...</span>
                  </div>
                  <div className="h-4 bg-zinc-800/50 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-800/50 rounded w-1/2"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-12 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition duration-500"></div>
            <div className="relative flex items-end bg-[#111111] border border-zinc-800 rounded-2xl p-2 shadow-2xl">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Describe your executive objective..."
                className="flex-1 bg-transparent border-0 focus:ring-0 text-zinc-100 placeholder-zinc-600 py-3 px-4 min-h-[56px] max-h-48 resize-none text-sm leading-relaxed"
                rows={1}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-xl transition-all ${
                  !input.trim() || isLoading
                    ? 'text-zinc-700 bg-transparent'
                    : 'text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20'
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </form>
          <div className="mt-3 flex items-center justify-center space-x-6 text-[10px] text-zinc-600 font-medium tracking-tight">
            <span>SHIFT + ENTER FOR NEW LINE</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <span>END-TO-END ENCRYPTED</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <span>POWERED BY GEMINI 3 PRO</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
