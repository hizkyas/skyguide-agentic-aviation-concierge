"use client";

import React, { useState, useEffect } from "react";
import { socket, connectSocket, disconnectSocket } from "@/lib/socket";
import AgentTerminal from "@/components/AgentTerminal";
import MapView from "@/components/MapView";
import ResultTimeline, { TimelineItem } from "@/components/ResultTimeline";
import HITLModal from "@/components/HITLModal";
import { Plane, Search, Sparkles, Send, Map as MapIcon, Calendar, Zap } from "lucide-react";

type ActiveView = "map" | "grid";

export default function Home() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [thoughts, setThoughts] = useState<{ message: string; agent: string }[]>([]);
  const [itinerary, setItinerary] = useState<TimelineItem[]>([]);
  const [hitlRequest, setHitlRequest] = useState<{ question: string; agent: string } | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>("map");

  useEffect(() => {
    connectSocket();

    socket.on("thought", (thought) => {
      setThoughts((prev) => [...prev, thought]);
    });

    socket.on("itinerary_update", (data) => {
      setItinerary(data);
    });

    socket.on("hitl_request", (data) => {
      setHitlRequest(data);
      setIsSearching(false);
    });

    socket.on("finish", (data) => {
      setItinerary(data.itinerary);
      setIsSearching(false);
      setHitlRequest(null);
      // Auto-switch to results view on completion
      if (data.itinerary?.length > 0) {
        setActiveView("grid");
      }
    });

    socket.on("error", (err) => {
      alert(`Error: ${err.message}`);
      setIsSearching(false);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setThoughts([]);
    setItinerary([]);
    setIsSearching(true);
    setHitlRequest(null);
    setActiveView("map"); // Show map while searching
    socket.emit("start_task", { query });
  };

  const handleHITLResponse = (response: "approved" | "declined") => {
    setHitlRequest(null);
    setIsSearching(true);
    socket.emit("user_response", { response });
  };

  // Extract origin/destination from itinerary for the map
  const flightItem = itinerary.find((i) => i.type === "flight");
  const mapOrigin = flightItem?.origin || "ADD";
  const mapDestination = flightItem?.destination || "NBO";

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-200 selection:bg-sky-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-6 relative grid grid-cols-12 gap-6 h-screen max-h-[100vh] overflow-hidden">

        {/* ─── Left Sidebar ─────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 h-full overflow-hidden">

          {/* Header */}
          <header className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-sky-500/80 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 active:scale-95 transition-transform">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none">SkyGuide AI</h1>
              <p className="text-xs font-bold text-sky-400 uppercase tracking-widest mt-1">Agentic Aviation Concierge</p>
            </div>
          </header>

          {/* Search Box */}
          <section className="p-1 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-2xl border border-zinc-800/50 shrink-0">
            <form onSubmit={handleSearch} className="bg-zinc-950 p-5 rounded-[14px]">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Plan Your Mission</span>
              </div>

              <div className="relative group/input">
                <textarea
                  id="search-query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Flight from Addis to London, or Nairobi to Dubai with a hotel"
                  className="w-full h-28 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:border-sky-500/50 focus:bg-zinc-900 transition-all resize-none group-hover/input:border-zinc-700 font-medium placeholder:text-zinc-600"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { label: "Addis → Dubai",      query: "Flight from Addis Ababa to Dubai with a hotel" },
                  { label: "Nairobi → London",   query: "I need a flight from Nairobi to London and accommodation" },
                  { label: "Addis → Lalibela",   query: "Flight from Addis Ababa to Lalibela with a hotel" },
                  { label: "Addis → Gondar",     query: "Fly from Addis to Gondar, find me a hotel" },
                  { label: "Nairobi → Mombasa",  query: "Flight from Nairobi to Mombasa with accommodation" },
                  { label: "Addis → Singapore",  query: "Fly from Addis to Singapore, find me a hotel" },
                ].map(({ label, query: q }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setQuery(q)}
                    className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full hover:border-zinc-600 hover:text-zinc-300 transition-all uppercase tracking-wide"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                id="launch-search-btn"
                disabled={isSearching}
                className={`mt-4 w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98] ${
                  isSearching
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-white text-zinc-950 hover:bg-zinc-200 shadow-xl hover:shadow-white/5"
                }`}
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                    <span>Engaging Agents...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Launch AI Search</span>
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Agent Terminal */}
          <section className="flex-1 overflow-hidden min-h-0">
            <AgentTerminal thoughts={thoughts} />
          </section>
        </div>

        {/* ─── Main Content ──────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-5 h-full overflow-hidden">

          {/* Top bar with view toggle */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl gap-1">
              <button
                id="view-map-btn"
                onClick={() => setActiveView("map")}
                className={`px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  activeView === "map"
                    ? "bg-zinc-800 text-white shadow-inner"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <MapIcon className="w-4 h-4" />
                Interactive Map
              </button>
              <button
                id="view-results-btn"
                onClick={() => setActiveView("grid")}
                className={`px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  activeView === "grid"
                    ? "bg-zinc-800 text-white shadow-inner"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Calendar className="w-4 h-4" />
                Flight Grid
                {itinerary.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-sky-500 text-white rounded-full text-[9px] font-bold leading-none">
                    {itinerary.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 uppercase">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-amber-400/70">LangGraph</span>
              </div>
              <div className="h-4 w-px bg-zinc-800" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Data Link
              </div>
              <div className="h-4 w-px bg-zinc-800" />
              <span>v1.0.4 · Alpha</span>
            </div>
          </div>

          {/* Content Panel */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {activeView === "map" ? (
              /* Map fills the full panel */
              <div className="h-full">
                <MapView
                  origin={mapOrigin}
                  destination={mapDestination}
                  itinerary={itinerary}
                />
              </div>
            ) : (
              /* Results Grid / Timeline */
              <div className="h-full overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {itinerary.length > 0 ? (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <ResultTimeline items={itinerary} />
                  </div>
                ) : (
                  <div className="h-full border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-4 text-zinc-500">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center opacity-50">
                      <Search className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold uppercase tracking-widest text-zinc-700">No Mission Data Loaded</p>
                      <p className="text-xs text-zinc-700 mt-1">Run a search to see your AI-curated itinerary</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mini map preview when viewing results */}
          {activeView === "grid" && itinerary.length > 0 && (
            <div className="h-48 shrink-0 animate-in fade-in duration-500">
              <MapView
                origin={mapOrigin}
                destination={mapDestination}
                itinerary={itinerary}
              />
            </div>
          )}
        </div>
      </div>

      <HITLModal
        isOpen={!!hitlRequest}
        question={hitlRequest?.question || ""}
        agent={hitlRequest?.agent || ""}
        onResponse={handleHITLResponse}
      />
    </main>
  );
}
