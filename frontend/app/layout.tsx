import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkyGuide AI — Agentic Aviation Concierge",
  description: "SkyGuide AI is a multi-agent travel concierge that finds optimal flights and accommodations using real-time aviation intelligence.",
  keywords: ["flight search", "AI travel", "aviation", "multi-agent", "concierge"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-screen w-screen flex bg-black text-white overflow-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 h-full relative">
          {children}
        </main>
      </body>
    </html>
  );
}
