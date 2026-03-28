"use client";

import React, { useMemo, useState } from "react";
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { ArcLayer, ScatterplotLayer } from "@deck.gl/layers";
import { Navigation, Plane } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import { type TimelineItem } from "@/components/ResultTimeline";

const AIRPORT_DB: Record<string, { name: string; city: string; coordinates: [number, number] }> = {
  // International
  ADD: { name: "Bole Intl", city: "Addis Ababa", coordinates: [38.7993, 8.9778] },
  NBO: { name: "JKIA", city: "Nairobi", coordinates: [36.9275, -1.3192] },
  DXB: { name: "Dubai Intl", city: "Dubai", coordinates: [55.3657, 25.2532] },
  DOH: { name: "Hamad Intl", city: "Doha", coordinates: [51.6138, 25.2609] },
  LHR: { name: "Heathrow", city: "London", coordinates: [-0.4543, 51.4700] },
  CDG: { name: "Charles de Gaulle", city: "Paris", coordinates: [2.5477, 49.0097] },
  FRA: { name: "Frankfurt Intl", city: "Frankfurt", coordinates: [8.5622, 50.0379] },
  AMS: { name: "Schiphol", city: "Amsterdam", coordinates: [4.7639, 52.3086] },
  IST: { name: "Istanbul Intl", city: "Istanbul", coordinates: [28.7519, 41.2753] },
  JNB: { name: "OR Tambo", city: "Johannesburg", coordinates: [28.2411, -26.1367] },
  CPT: { name: "Cape Town Intl", city: "Cape Town", coordinates: [18.6021, -33.9648] },
  CAI: { name: "Cairo Intl", city: "Cairo", coordinates: [31.4056, 30.1219] },
  LOS: { name: "Murtala Muhammed", city: "Lagos", coordinates: [3.3212, 6.5774] },
  ACC: { name: "Kotoka Intl", city: "Accra", coordinates: [-0.1669, 5.6052] },
  KGL: { name: "Kigali Intl", city: "Kigali", coordinates: [30.1395, -1.9686] },
  EBB: { name: "Entebbe Intl", city: "Kampala", coordinates: [32.4432, 0.0424] },
  DAR: { name: "Julius Nyerere Intl", city: "Dar es Salaam", coordinates: [39.2026, -6.8780] },
  MBA: { name: "Moi Intl", city: "Mombasa", coordinates: [39.5944, -4.0348] },
  SIN: { name: "Changi", city: "Singapore", coordinates: [103.9915, 1.3644] },
  BKK: { name: "Suvarnabhumi", city: "Bangkok", coordinates: [100.7474, 13.6811] },
  BOM: { name: "Chhatrapati Shivaji", city: "Mumbai", coordinates: [72.8656, 19.0896] },
  DEL: { name: "Indira Gandhi Intl", city: "Delhi", coordinates: [77.1025, 28.5562] },
  NRT: { name: "Narita Intl", city: "Tokyo", coordinates: [140.3929, 35.7720] },
  HKG: { name: "Hong Kong Intl", city: "Hong Kong", coordinates: [113.9145, 22.3080] },
  SYD: { name: "Kingsford Smith", city: "Sydney", coordinates: [151.1753, -33.9399] },
  JFK: { name: "John F. Kennedy Intl", city: "New York", coordinates: [-73.7781, 40.6413] },
  LAX: { name: "Los Angeles Intl", city: "Los Angeles", coordinates: [-118.4081, 33.9425] },
  ORD: { name: "O'Hare Intl", city: "Chicago", coordinates: [-87.9048, 41.9742] },
  ATL: { name: "Hartsfield-Jackson", city: "Atlanta", coordinates: [-84.4277, 33.6407] },
  MIA: { name: "Miami Intl", city: "Miami", coordinates: [-80.2906, 25.7959] },
  YYZ: { name: "Pearson Intl", city: "Toronto", coordinates: [-79.6306, 43.6777] },
  GRU: { name: "Guarulhos Intl", city: "São Paulo", coordinates: [-46.4731, -23.4356] },
  KWI: { name: "Kuwait Intl", city: "Kuwait City", coordinates: [47.9689, 29.2267] },
  AUH: { name: "Zayed Intl", city: "Abu Dhabi", coordinates: [54.6511, 24.4330] },
  RUH: { name: "King Khalid Intl", city: "Riyadh", coordinates: [46.6988, 24.9576] },
  ZRH: { name: "Zurich Intl", city: "Zurich", coordinates: [8.5492, 47.4647] },
  MAD: { name: "Adolfo Suárez Barajas", city: "Madrid", coordinates: [-3.5673, 40.4936] },
  FCO: { name: "Leonardo da Vinci", city: "Rome", coordinates: [12.2388, 41.8003] },
  LIS: { name: "Humberto Delgado", city: "Lisbon", coordinates: [-9.1354, 38.7813] },
  BCN: { name: "El Prat", city: "Barcelona", coordinates: [2.0785, 41.2971] },
  VIE: { name: "Vienna Intl", city: "Vienna", coordinates: [16.5697, 48.1103] },
  ICN: { name: "Incheon Intl", city: "Seoul", coordinates: [126.4407, 37.4691] },
  // Ethiopian domestic
  DIR: { name: "Aba Tenna Dejazmach", city: "Dire Dawa", coordinates: [41.8542, 9.6247] },
  BJR: { name: "Bahir Dar Airport", city: "Bahir Dar", coordinates: [37.3217, 11.6081] },
  GDQ: { name: "Gondar Airport", city: "Gondar", coordinates: [37.4340, 12.5199] },
  LLI: { name: "Lalibela Airport", city: "Lalibela", coordinates: [38.9800, 11.9750] },
  AXU: { name: "Axum Airport", city: "Axum", coordinates: [38.7728, 14.1468] },
  JIM: { name: "Jimma Airport", city: "Jimma", coordinates: [36.8166, 7.6661] },
  MQX: { name: "Mekelle Airport", city: "Mekelle", coordinates: [39.5335, 13.4674] },
  AWA: { name: "Hawassa Airport", city: "Hawassa", coordinates: [38.4630, 7.0660] },
  AMH: { name: "Arba Minch Airport", city: "Arba Minch", coordinates: [37.5905, 6.0394] },
  GMB: { name: "Gambella Airport", city: "Gambella", coordinates: [34.5631, 8.1288] },
  JIJ: { name: "Wilwal Intl", city: "Jijiga", coordinates: [42.9121, 9.3325] },
  DSE: { name: "Combolcha Airport", city: "Dessie", coordinates: [39.7114, 11.0825] },
  SHC: { name: "Shire Airport", city: "Shire", coordinates: [38.2720, 14.0781] },
  SZE: { name: "Semera Airport", city: "Semera", coordinates: [40.9910, 11.7875] },
  // Kenyan domestic
  EDL: { name: "Eldoret Intl", city: "Eldoret", coordinates: [35.2389, 0.4045] },
  KIS: { name: "Kisumu Intl", city: "Kisumu", coordinates: [34.7290, -0.0861] },
  MYD: { name: "Malindi Airport", city: "Malindi", coordinates: [40.1017, -3.2293] },
  LAU: { name: "Lamu Airport", city: "Lamu", coordinates: [41.5486, -2.2524] },
  WJR: { name: "Wajir Airport", city: "Wajir", coordinates: [40.0916, 1.7332] },
  LOK: { name: "Lodwar Airport", city: "Lodwar", coordinates: [35.6087, 3.1219] },
  WIL: { name: "Wilson Airport", city: "Nairobi (domestic)", coordinates: [36.8148, -1.3212] },
  // South African domestic
  DUR: { name: "King Shaka Intl", city: "Durban", coordinates: [31.1197, -29.6145] },
  GRJ: { name: "George Airport", city: "George", coordinates: [22.3789, -34.0056] },
  BFN: { name: "Bram Fischer Intl", city: "Bloemfontein", coordinates: [26.3024, -29.0927] },
  ELS: { name: "East London Airport", city: "East London", coordinates: [27.8259, -33.0356] },
  PLZ: { name: "Chief Dawid Stuurman Intl", city: "Port Elizabeth", coordinates: [25.6173, -33.9849] },
};

// ── Auto-center the view between two airports ─────────────────────────────────
function getMidpoint(a: [number, number], b: [number, number]): { longitude: number; latitude: number; zoom: number } {
  const midLng = (a[0] + b[0]) / 2;
  const midLat = (a[1] + b[1]) / 2;
  const distLng = Math.abs(a[0] - b[0]);
  const distLat = Math.abs(a[1] - b[1]);
  const dist = Math.max(distLng, distLat);
  // Map distance to zoom level
  const zoom = dist < 5 ? 7 : dist < 15 ? 5.5 : dist < 40 ? 4 : dist < 80 ? 3 : dist < 150 ? 2.5 : 2;
  return { longitude: midLng, latitude: midLat, zoom };
}

interface MapViewProps {
  origin?: string;
  destination?: string;
  itinerary?: TimelineItem[];
}

export default function MapView({ origin = "ADD", destination = "NBO", itinerary = [] }: MapViewProps) {
  const originAirport = AIRPORT_DB[origin] || AIRPORT_DB["ADD"];
  const destAirport = AIRPORT_DB[destination] || AIRPORT_DB["NBO"];

  const mid = useMemo(
    () => getMidpoint(originAirport.coordinates, destAirport.coordinates),
    [origin, destination]
  );

  const [viewState, setViewState] = useState({
    longitude: mid.longitude,
    latitude: mid.latitude,
    zoom: mid.zoom,
    pitch: 40,
    bearing: 0,
  });

  // Update view when route changes
  useMemo(() => {
    setViewState({
      longitude: mid.longitude,
      latitude: mid.latitude,
      zoom: mid.zoom,
      pitch: 40,
      bearing: 0,
    });
  }, [origin, destination]);

  // Arc between airports
  const arcData = useMemo(() => [{
    from: originAirport.coordinates,
    to: destAirport.coordinates,
  }], [origin, destination]);

  // Airport scatter dots
  const airportDots = useMemo(() => [
    { id: origin, coordinates: originAirport.coordinates, isOrigin: true },
    { id: destination, coordinates: destAirport.coordinates, isOrigin: false },
  ], [origin, destination]);

  // Hotel markers
  const hotelDots = useMemo(() => {
    return (itinerary || [])
      .filter((item) => item.type === "hotel" && item.lat && item.lng)
      .map((item) => ({
        id: item.name ?? "hotel",
        coordinates: [item.lng as number, item.lat as number] as [number, number],
      }));
  }, [itinerary]);

  const layers = [
    new ArcLayer({
      id: "flight-arc",
      data: arcData,
      getSourcePosition: (d: { from: [number, number] }) => d.from,
      getTargetPosition: (d: { to: [number, number] }) => d.to,
      getSourceColor: [14, 165, 233, 220],
      getTargetColor: [16, 185, 129, 220],
      getWidth: 2.5,
      getHeight: 0.7,
    }),
    new ScatterplotLayer({
      id: "airport-dots",
      data: airportDots,
      getPosition: (d: { coordinates: [number, number] }) => d.coordinates,
      getRadius: 35000,
      getFillColor: (d: { isOrigin: boolean }) =>
        d.isOrigin ? [14, 165, 233, 200] : [16, 185, 129, 200],
      getLineColor: [255, 255, 255, 60],
      lineWidthMinPixels: 1,
      stroked: true,
      pickable: true,
    }),
    new ScatterplotLayer({
      id: "hotel-dots",
      data: hotelDots,
      getPosition: (d: { coordinates: [number, number] }) => d.coordinates,
      getRadius: 20000,
      getFillColor: [245, 158, 11, 220], // amber
      getLineColor: [255, 255, 255, 80],
      lineWidthMinPixels: 1,
      stroked: true,
      pickable: true,
    }),
  ];

  return (
    <div className="relative w-full h-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-inner group">
      <DeckGL
        viewState={viewState}
        controller={true}
        layers={layers}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onViewStateChange={(e: any) => setViewState(e.viewState)}
      >
        <Map
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          reuseMaps
        />
      </DeckGL>

      {/* Map Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        <div className="p-2 bg-zinc-950/80 border border-zinc-800 rounded-lg backdrop-blur-md shadow-2xl">
          <Navigation className="w-5 h-5 text-zinc-400 cursor-pointer hover:text-white transition-colors" />
        </div>
        <div className="p-2 bg-zinc-950/80 border border-zinc-800 rounded-lg backdrop-blur-md shadow-2xl">
          <Plane className="w-5 h-5 text-zinc-400 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Route label */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-zinc-950/90 border border-zinc-800 rounded-full backdrop-blur-xl shadow-2xl flex items-center gap-5 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">WebGL Engine Active</span>
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-sky-400">{originAirport.city}</div>
            <div className="text-[9px] text-zinc-600 uppercase tracking-widest">{origin}</div>
          </div>
          <Plane className="w-4 h-4 text-zinc-600 rotate-90" />
          <div>
            <div className="text-xs font-bold text-emerald-400">{destAirport.city}</div>
            <div className="text-[9px] text-zinc-600 uppercase tracking-widest">{destination}</div>
          </div>
        </div>
        {hotelDots.length > 0 && (
          <>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-bold text-amber-400/70 uppercase tracking-widest">
                {hotelDots.length} Hotel{hotelDots.length > 1 ? "s" : ""}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
