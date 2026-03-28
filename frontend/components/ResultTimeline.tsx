"use client";

import React from "react";
import { Plane, Building, MapPin, Clock, ArrowRight } from "lucide-react";

export interface TimelineItem {
  type: "flight" | "hotel";
  details?: string;
  origin?: string;
  destination?: string;
  origin_label?: string;
  destination_label?: string;
  departure?: string;
  arrival?: string;
  price?: string;
  name?: string;
  rating?: number;
  lat?: number;
  lng?: number;
}

interface ResultTimelineProps {
  items: TimelineItem[];
}

const ResultTimeline: React.FC<ResultTimelineProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 p-6 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
          <MapPin className="w-4 h-4 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">AI-Curated Itinerary</h2>
      </div>

      <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
        {items.map((item, idx) => (
          <div key={idx} className="relative pl-12 group">
            {/* Timeline dot */}
            <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center z-10 group-hover:border-zinc-700 transition-colors">
              {item.type === "flight" ? (
                <Plane className="w-5 h-5 text-sky-400" />
              ) : (
                <Building className="w-5 h-5 text-emerald-400" />
              )}
            </div>

            <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg group-hover:bg-zinc-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {item.type === "flight" ? "Flight Segment" : "Accommodation"}
                </span>
                {item.price && (
                  <span className="text-sm font-bold text-emerald-400">{item.price}</span>
                )}
              </div>

              {item.type === "flight" ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-lg font-bold text-zinc-200">
                        {item.origin_label || item.origin}
                      </div>
                      {item.origin_label && (
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.origin}</div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 shrink-0" />
                    <div>
                      <div className="text-lg font-bold text-zinc-200">
                        {item.destination_label || item.destination}
                      </div>
                      {item.destination_label && (
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.destination}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {item.departure} - {item.arrival}
                    </div>
                    <div className="font-medium text-zinc-300">{item.details}</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-lg font-bold text-zinc-100">{item.name}</div>
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < (item.rating || 0) ? "text-amber-400" : "text-zinc-700 text-xs"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-zinc-400 italic text-xs leading-relaxed max-w-[300px]">
                      {item.details}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4 border-t border-zinc-800">
        <button className="flex-1 px-4 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-sky-600/10 active:shadow-none">
          Confirm & Book
        </button>
        <button className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-lg border border-zinc-700 transition-all active:scale-95">
          Ask Modification
        </button>
      </div>
    </div>
  );
};

export default ResultTimeline;
