"use client";

import React from "react";
import { Database, Server, Webhook, Bot, ArrowRight, Zap, RefreshCw } from "lucide-react";

export default function ArchitecturePage() {
  const agents = [
    {
      name: "Flight Navigator",
      icon: Webhook,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      desc: "Queries the AviationStack API for live hub mappings and price distributions."
    },
    {
      name: "Meteorologist",
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      desc: "Geocodes destination strings and pulls dynamic weather conditions utilizing the Open-Meteo REST API."
    },
    {
      name: "Playwright Scout",
      icon: Server,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      desc: "Deploys a headless Chromium ghost-browser to fetch unstructured live data (hotels, packages) from Google/DDG directly into LangGraph state."
    },
    {
      name: "Curator LLM",
      icon: Bot,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      desc: "Aggregates weather, flights, and accommodations to construct a strict JSON timeline validated against human-in-the-loop policies."
    }
  ];

  return (
    <div className="h-full p-8 overflow-y-auto w-full bg-[#050505]">
      <header className="mb-14 max-w-4xl">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          <Database className="w-8 h-8 text-sky-400" />
          System Architecture
        </h1>
        <p className="text-zinc-400 mt-4 leading-relaxed font-mono text-sm max-w-3xl">
          SkyGuide AI is entirely powered by a centralized State Graph orchestration loop (LangGraph) backed by distributed memory (Redis). Data ingestion happens programmatically and seamlessly inside the Python Fast API runtime.
        </p>
      </header>

      <section className="mb-16 max-w-5xl">
         <h2 className="text-xl font-bold text-white mb-6 tracking-wide">THE MULTI-AGENT PIPELINE</h2>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {agents.map((agent, i) => (
               <div key={agent.name} className="relative group">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full flex flex-col gap-4 hover:border-zinc-700 transition-colors z-10 relative">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${agent.bg}`}>
                        <agent.icon className={`w-6 h-6 ${agent.color}`} />
                     </div>
                     <h3 className="font-bold text-lg text-zinc-100">{agent.name}</h3>
                     <p className="text-sm text-zinc-400 leading-relaxed font-mono">{agent.desc}</p>
                  </div>
                  {i !== agents.length - 1 && (
                     <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-0 opacity-50">
                        <ArrowRight className="w-8 h-8 text-zinc-700" />
                     </div>
                  )}
               </div>
            ))}
         </div>
      </section>

      <section className="mb-16 max-w-5xl">
         <h2 className="text-xl font-bold text-white mb-6 tracking-wide">PERSISTENCE INFRASTRUCTURE</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-600/10 to-zinc-950 border border-red-900/40 rounded-2xl p-8">
               <div className="flex items-center gap-3 mb-4">
                  <RefreshCw className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-bold text-red-100">Redis Checkpointing</h3>
               </div>
               <p className="text-zinc-400 text-sm font-mono leading-relaxed">
                  The LLM graph maintains conversational memory independent of UI sockets by dumping State Arrays mapped to user Thread IDs directly into Redis caches. This supports distributed server loads across Kubernetes or Docker container instances seamlessly.
               </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600/10 to-zinc-950 border border-blue-900/40 rounded-2xl p-8">
               <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-blue-100">PostgreSQL History</h3>
               </div>
               <p className="text-zinc-400 text-sm font-mono leading-relaxed">
                  Finalized AI operations and user behavioral profiles are structured via SQLAlchemy ORM mapping and stored durably on a backend PostgreSQL volume. Used strictly for Dashboard queries and sharing metrics.
               </p>
            </div>
         </div>
      </section>
    </div>
  );
}
