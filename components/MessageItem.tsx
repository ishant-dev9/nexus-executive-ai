
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, MessageRole, StructuredResponse } from '../types';

interface MessageItemProps {
  message: Message;
}

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : '';

  const handleCopy = async () => {
    const textToCopy = String(children).replace(/\n$/, '');
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (inline) {
    return (
      <code className="bg-zinc-800/80 px-1.5 py-0.5 rounded text-blue-400 text-[0.9em] font-medium mono" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative my-6 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl group/code">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mono pl-2">
            {lang || 'terminal'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-1.5 px-2 py-1 rounded-md transition-all duration-200 ${
            copied 
            ? 'text-emerald-400 bg-emerald-500/10' 
            : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">Copied</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-5 overflow-x-auto custom-scrollbar">
        <pre className="m-0 p-0 bg-transparent border-0">
          <code className="block text-sm text-zinc-300 mono leading-relaxed" {...props}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  if (isUser) {
    return (
      <div className="flex justify-end mb-8 px-4">
        <div className="max-w-[80%] bg-blue-600/10 border border-blue-500/30 rounded-2xl px-6 py-4 shadow-sm">
          <p className="text-zinc-100 leading-relaxed whitespace-pre-wrap">{message.content as string}</p>
        </div>
      </div>
    );
  }

  const res = message.content as StructuredResponse;

  return (
    <div className="flex justify-start mb-12 px-4 group">
      <div className="w-full max-w-4xl space-y-6">
        {/* Plan Header */}
        {res.plan && res.plan.length > 0 && (
          <div className="flex flex-col space-y-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-blue-400">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              <span>Strategic Plan</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {res.plan.map((step, idx) => (
                <div key={idx} className="bg-zinc-800/50 border border-zinc-700 rounded-md px-3 py-1 text-xs text-zinc-400 mono">
                  {idx + 1}. {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Execution (Main Content) */}
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-6 text-[10px] uppercase tracking-widest font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span>Execution Output</span>
          </div>
          <div className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-p:leading-relaxed prose-headings:text-white prose-strong:text-blue-400 prose-li:text-zinc-300">
             <ReactMarkdown 
               components={{
                 code: CodeBlock
               }}
             >
               {res.execution}
             </ReactMarkdown>
          </div>
        </div>

        {/* Verification */}
        {res.verification && (
          <div className="border-l-2 border-amber-500/30 pl-6 py-2">
            <div className="flex items-center space-x-2 mb-2 text-[10px] uppercase tracking-widest font-bold text-amber-400">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              <span>Verification & Limitations</span>
            </div>
            <p className="text-sm text-zinc-400 italic font-light leading-relaxed">
              {res.verification}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
