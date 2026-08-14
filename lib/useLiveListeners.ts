"use client";

import { useEffect, useState } from "react";

export function useLiveListeners(): number {
  const [listenerCount, setListenerCount] = useState<number>(1);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Retrieve or create persistent session ID for this browser tab
    let visitorId = sessionStorage.getItem("devbhoomi_visitor_id");
    if (!visitorId) {
      visitorId = "v_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      sessionStorage.setItem("devbhoomi_visitor_id", visitorId);
    }

    const sendPing = async () => {
      try {
        const res = await fetch("/api/listeners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, action: "ping" }),
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.count === "number") {
            setListenerCount(data.count);
          }
        }
      } catch (err) {
        console.debug("Presence ping failed", err);
      }
    };

    // Initial ping
    sendPing();

    // Heartbeat every 10 seconds
    const interval = setInterval(sendPing, 10000);

    // On tab close / navigation, notify server to immediately decrement
    const handleUnload = () => {
      const payload = JSON.stringify({ visitorId, action: "leave" });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/listeners", new Blob([payload], { type: "application/json" }));
      }
    };

    window.addEventListener("pagehide", handleUnload);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("pagehide", handleUnload);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return listenerCount;
}
