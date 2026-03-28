"use client";

import React from "react";
import { Plane, Calendar, MoreHorizontal, Database } from "lucide-react";

export default function DashboardPage() {
  const mockMissions = [
    { id: "sg-8942", destination: "Dubai", date: "Oct 24, 2026", status: "Active" },
    { id: "sg-1021", destination: "Nairobi", date: "Dec 05, 2026", status: "Draft" },
    { id: "sg-3349", destination: "London", date: "Jan 12, 2027", status: "Completed" },
  ];

  return (
    <div className="h-full p-8 overflow-y-auto w-full">
      <header className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Database className="w-8 h-8 text-sky-400" />
          Mission Dashboard
        </h1>
        <p className="text-zinc-500 mt-2">Manage your AI-curated travel payloads stored securely via PostgreSQL.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
           <div className="text-zinc-500 font-bold uppercase tracking-wider text-xs mb-1">Total Trips</div>
           <div className="text-4xl font-bold text-white">42</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
           <div className="text-zinc-500 font-bold uppercase tracking-wider text-xs mb-1">Upcoming</div>
           <div className="text-4xl font-bold text-emerald-400">2</div>
        </div>
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-6">
           <div className="text-sky-500 font-bold uppercase tracking-wider text-xs mb-1">Active Checkpoints</div>
           <div className="text-4xl font-bold text-sky-400">12k+</div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
         <div className="p-5 border-b border-zinc-800 bg-zinc-950 font-bold">Recent Extractions</div>
         <table className="w-full text-left">
           <thead>
             <tr className="text-xs text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50">
               <th className="font-semibold p-4">Mission ID</th>
               <th className="font-semibold p-4">Destination</th>
               <th className="font-semibold p-4">Date</th>
               <th className="font-semibold p-4">Status</th>
               <th className="font-semibold p-4 w-10"></th>
             </tr>
           </thead>
           <tbody>
             {mockMissions.map(m => (
               <tr key={m.id} className="border-b border-zinc-800 last:border-none hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4 font-mono text-xs font-bold text-sky-400">{m.id}</td>
                  <td className="p-4 flex items-center gap-2 font-bold">
                    <Plane className={m.status === 'Active' ? 'text-white w-4 h-4' : 'text-zinc-600 w-4 h-4'} />
                    <span className={m.status === 'Active' ? 'text-white' : 'text-zinc-400'}>{m.destination}</span>
                  </td>
                  <td className="p-4 text-sm text-zinc-400 font-mono">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                       {m.date}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border ${
                       m.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                       m.status === 'Draft' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                       'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-500 hover:text-white cursor-pointer"><MoreHorizontal className="w-4 h-4" /></td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
}
