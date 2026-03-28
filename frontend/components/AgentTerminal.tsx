"use client";

import React, { useEffect, useRef } from "react";
import { Terminal, Plane, Search, CheckCircle2, User } from "lucide-react";

interface Thought {
  message: string;
  agent: string;
}

interface AgentTerminalProps {
  thoughts: Thought[];
}

const AgentTerminal: React.FC<AgentTerminalProps> = ({ thoughts }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = React.useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Disable auto-tracking if the user manually scrolled up
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 20;
    setIsAutoScrollEnabled(isAtBottom);
  };

  useEffect(() => {
    if (scrollRef.current && isAutoScrollEnabled) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thoughts, isAutoScrollEnabled]);

  const getAgentIcon = (agent: string) => {
    switch (agent.toLowerCase()) {
      case "navigator":
        return <Plane className="w-4 h-4 text-sky-400" />;
      case "scout":
        return <Search className="w-4 h-4 text-emerald-400" />;
      case "curator":
        return <CheckCircle2 className="w-4 h-4 text-purple-400" />;
      case "system":
        return <Terminal className="w-4 h-4 text-zinc-400" />;
      default:
        return <Terminal className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-400" />
          <span className="text-zinc-200 uppercase tracking-tighter font-bold">Live Thought Trace</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
             onClick={() => setIsAutoScrollEnabled(!isAutoScrollEnabled)}
             className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border transition-colors ${
               isAutoScrollEnabled 
                 ? "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20" 
                 : "bg-zinc-800 text-zinc-500 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-300"
             }`}
          >
             <div className={`w-1.5 h-1.5 rounded-full ${isAutoScrollEnabled ? 'bg-sky-400 animate-pulse' : 'bg-zinc-600'}`} />
             Auto Scroll
          </button>
          <div className="flex gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isAutoScrollEnabled ? 'bg-zinc-700' : 'bg-zinc-800'}`} />
            <div className={`w-2 h-2 rounded-full ${isAutoScrollEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`} />
          </div>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {thoughts.length === 0 && (
          <div className="text-zinc-600 italic">Waiting for agent request...</div>
        )}
        
        {thoughts.map((thought, idx) => (
          <div key={idx} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="mt-0.5 shrink-0">
              {getAgentIcon(thought.agent)}
            </div>
            <div className="flex-1">
              <span className="text-zinc-500 font-bold uppercase text-[10px] block leading-none mb-1">
                {thought.agent}
              </span>
              <p className="text-zinc-300 leading-relaxed">
                {thought.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentTerminal;
