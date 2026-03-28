import React, { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { socket } from "@/lib/socket";

interface Message {
  role: "user" | "agent";
  content: string;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", content: "I've built your itinerary. What would you like to adjust or refine?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Listen for socket responses
  React.useEffect(() => {
    const handleResponse = (data: { message: string }) => {
      setMessages(prev => [...prev, { role: "agent", content: data.message }]);
      setIsTyping(false);
    };

    socket.on("chat_response", handleResponse);
    return () => {
      socket.off("chat_response", handleResponse);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsTyping(true);

    // Send through existing socket connection
    socket.emit("submit_chat", { message: userMsg });
  };

  return (
    <div className="flex flex-col h-[500px] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
      <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
         <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
           <Bot className="w-4 h-4 text-sky-400" />
           AI Travel Curator
         </h3>
         <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
         </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "agent" && (
              <div className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-3 h-3 text-sky-400" />
              </div>
            )}
            
            <div className={`p-3 rounded-lg max-w-[85%] text-sm ${
              msg.role === "user" 
                ? "bg-zinc-800 text-zinc-200 rounded-tr-sm" 
                : "bg-sky-950/40 border border-sky-900/50 text-zinc-300 rounded-tl-sm"
            }`}>
              {msg.content}
            </div>

            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                <User className="w-3 h-3 text-zinc-400" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
           <div className="flex gap-3 justify-start">
             <div className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-3 h-3 text-sky-400" />
              </div>
              <div className="p-3 bg-sky-950/40 border border-sky-900/50 rounded-lg rounded-tl-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500/50 animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500/50 animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500/50 animate-bounce delay-300"></span>
                </div>
              </div>
           </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-2.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
