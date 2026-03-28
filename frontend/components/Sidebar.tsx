"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane, Compass, LayoutDashboard, Database } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Mission Control", href: "/", icon: Plane },
    { name: "Explore Hub", href: "/explore", icon: Compass },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Architecture", href: "/architecture", icon: Database },
  ];

  return (
    <div className="w-64 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
          <Plane className="w-4 h-4 text-sky-400" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight text-white tracking-tight">SkyGuide</span>
          <span className="text-[10px] text-zinc-500 tracking-widest uppercase">Multi-Agent</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-900 mx-4 mb-4 rounded-xl bg-zinc-900/50 text-center">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Live Services</div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-zinc-300">Agents Online</span>
        </div>
      </div>
    </div>
  );
}
