"use client";

import React from "react";
import { AlertCircle, Check, X, ShieldAlert } from "lucide-react";

interface HITLModalProps {
  isOpen: boolean;
  question: string;
  agent: string;
  onResponse: (response: "approved" | "declined") => void;
}

const HITLModal: React.FC<HITLModalProps> = ({ isOpen, question, agent, onResponse }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900/50 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest leading-none">Agent Intervention Required</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Source: {agent} Agent</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex gap-4 mb-8">
             <AlertCircle className="w-6 h-6 text-sky-400 shrink-0 mt-1" />
             <p className="text-zinc-300 leading-relaxed font-medium italic text-lg">
               &quot;{question}&quot;
             </p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onResponse("approved")}
              className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-sky-600/20"
            >
              <Check className="w-5 h-5" />
              Approve Segment
            </button>
            <button 
              onClick={() => onResponse("declined")}
              className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl flex items-center justify-center gap-2 border border-zinc-800 transition-all active:scale-[0.98]"
            >
              <X className="w-5 h-5" />
              Decline & Re-route
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-900/20 border-t border-zinc-800 flex justify-center">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">
            SkyGuide AI Secure Execution Gate
          </p>
        </div>
      </div>
    </div>
  );
};

export default HITLModal;
