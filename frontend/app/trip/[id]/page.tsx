"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ResultTimeline, { TimelineItem } from "@/components/ResultTimeline";
import MapView from "@/components/MapView";
import { Plane, Link as LinkIcon, AlertTriangle } from "lucide-react";

export default function ShareableTripPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [itinerary, setItinerary] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await fetch(`http://localhost:8001/api/itinerary/${id}`);
        const data = await res.json();
        if (data.status === "success" && data.itinerary.length > 0) {
           setItinerary(data.itinerary);
        } else {
           setError("Mission itinerary not found or has expired.");
        }
      } catch (err) {
        setError("Network error bridging to LangGraph server.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchTrip();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
     return (
        <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400 p-6 flex-col gap-4">
           <AlertTriangle className="w-12 h-12 text-red-500 opacity-50" />
           <p>{error}</p>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono py-12 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
            <Plane className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">SkyGuide AI</h1>
            <p className="text-xs text-zinc-500 tracking-widest mt-1 uppercase">Mission Access Payload</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 shadow-sm">
           <LinkIcon className="w-3.5 h-3.5" />
           READ-ONLY
        </div>
      </header>
      
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
        {/* Timeline */}
        <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
           <ResultTimeline items={itinerary} />
        </div>
        
        {/* Render Map */}
        <div className="h-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
           <MapView 
               origin={itinerary[0]?.origin || ""} 
               destination={itinerary[0]?.destination || ""} 
               itinerary={itinerary} 
           />
        </div>
      </div>
    </div>
  );
}
