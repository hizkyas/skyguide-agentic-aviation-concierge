"use client";

import React from "react";
import { Compass, Sparkles, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ExplorePage() {
  const destinations = [
    { city: "Addis Ababa", tag: "Historical Rift", price: "$200/night", img: "https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=800&q=80" },
    { city: "Dubai", tag: "Luxury Escape", price: "$500/night", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80" },
    { city: "Nairobi", tag: "Safari Gateway", price: "$350/night", img: "https://images.unsplash.com/photo-1547471080-7bc2caa7ee0a?auto=format&fit=crop&w=800&q=80" },
    { city: "London", tag: "Urban Metropolitan", price: "$600/night", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80" },
    { city: "Singapore", tag: "Technological Oasis", price: "$450/night", img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80" },
    { city: "Mombasa", tag: "Coastal Retreat", price: "$150/night", img: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <div className="h-full p-8 overflow-y-auto w-full">
      <header className="mb-10 max-w-4xl">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Compass className="w-8 h-8 text-sky-400" />
          Explore the World
        </h1>
        <p className="text-zinc-400 mt-3 max-w-2xl leading-relaxed">
          Select any global destination to instantly initialize a LangGraph multi-agent mission. Our AI will automatically orchestrate real-time weather scraping, premium accommodation hunting, and flight mapping.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl">
        {destinations.map((dest) => (
          <Link 
             href="/" 
             key={dest.city}
             className="h-72 rounded-2xl border border-zinc-800 p-6 flex flex-col justify-end relative overflow-hidden group hover:border-zinc-500 transition-all bg-zinc-900"
          >
            {/* Background Image Loading behind overlay */}
            <div 
               className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80 mix-blend-luminosity hover:mix-blend-normal"
               style={{ backgroundImage: `url(${dest.img})` }}
            />
            
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />
            
            <div className="relative z-10 flex flex-col gap-2 translate-y-4 group-hover:translate-y-0 transition-transform">
              <div className="flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-zinc-400" />
                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{dest.tag}</span>
              </div>
              <h2 className="text-3xl font-bold text-white">{dest.city}</h2>
              <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-75">
                 <span className="text-sm font-bold text-sky-400 tracking-wider">Estimate: {dest.price}</span>
                 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-black" />
                 </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 max-w-7xl bg-sky-500/10 border border-sky-500/20 rounded-2xl p-8 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/20 flex items-center justify-center">
               <Sparkles className="w-8 h-8 text-sky-400" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-white mb-2">Want a custom mission?</h3>
               <p className="text-zinc-400 text-sm">Tell the AI exactly what you want on the Mission Control grid.</p>
            </div>
         </div>
         <Link href="/" className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">
            Open Control Center
         </Link>
      </div>
    </div>
  );
}
