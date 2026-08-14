"use client";

import { useEffect, useState } from "react";

// Formatter created at module scope for maximum performance
const kolkataTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function LiveClock() {
  const [timeParts, setTimeParts] = useState<{ hour: string; minute: string; period: string } | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const formatted = kolkataTimeFormatter.format(new Date());
      // format is e.g. "8:30 pm" or "10:45 am"
      const match = formatted.match(/(\d+):(\d+)\s*(am|pm|AM|PM)?/i);
      if (match) {
        setTimeParts({
          hour: match[1],
          minute: match[2],
          period: (match[3] || "").toUpperCase(),
        });
      } else {
        const parts = formatted.split(":");
        if (parts.length >= 2) {
          const minAndPeriod = parts[1].trim().split(" ");
          setTimeParts({
            hour: parts[0].trim(),
            minute: minAndPeriod[0] || "00",
            period: (minAndPeriod[1] || "").toUpperCase(),
          });
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeParts) {
    return (
      <div className="glass-pill-subtle flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-white/90 shadow-lg">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[11px] tracking-wider text-white/60">ALMORA --:-- IST</span>
      </div>
    );
  }

  return (
    <div className="glass-pill-subtle group flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-xs text-white/90 shadow-lg transition-all hover:border-white/20">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <div className="flex items-center font-mono text-[12px] font-medium tracking-wider text-white/90">
        <span className="text-white/60 mr-1.5 text-[10px] uppercase tracking-widest hidden sm:inline">ALMORA</span>
        <span>{timeParts.hour}</span>
        <span className="animate-blink px-[1.5px] text-amber-400 font-bold">:</span>
        <span>{timeParts.minute}</span>
        <span className="ml-1 text-[10px] text-amber-300/80 font-semibold">{timeParts.period}</span>
        <span className="ml-1.5 text-[9.5px] text-white/40 tracking-tight">IST</span>
      </div>
    </div>
  );
}
