"use client";

import { useState } from "react";
import { PLAYLISTS } from "@/lib/tracks";
import { Playlist } from "@/lib/types";
import { TopBar } from "./TopBar";
import { MusicPlayer } from "./MusicPlayer";
import { useLiveListeners } from "@/lib/useLiveListeners";

export function ClientApp() {
  const [playlists] = useState<Playlist[]>(PLAYLISTS);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>(PLAYLISTS[0]);
  const liveCount = useLiveListeners();

  const handleSelectPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    trackPlaylistChange(playlist.id, playlist.name);
  };

  return (
    <>
      {/* Fixed Top Row */}
      <TopBar
        playlists={playlists}
        currentPlaylist={currentPlaylist}
        onSelectPlaylist={handleSelectPlaylist}
        listenerCount={liveCount}
      />

      {/* Center Mountain Ambient Tagline */}
      <div className="flex-1 flex flex-col items-center justify-center pointer-events-none z-10 px-4 text-center my-auto">
        <div className="space-y-3 max-w-lg transition-all">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[11px] text-amber-300 font-mono tracking-wider shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>KUMAON & GARHWAL • NH-309</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] font-sans">
            देवभूमि Radio
          </h1>

          <p className="text-xs sm:text-sm text-white/80 max-w-sm sm:max-w-md mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {currentPlaylist.description}
          </p>

          <div className="pt-2 flex items-center justify-center gap-3 text-[11px] font-mono text-white/50">
            <span>ALMORA 36 KM</span>
            <span>•</span>
            <span>MUNSYARI 120 KM</span>
            <span>•</span>
            <span>BAGESHWAR 80 KM</span>
          </div>
        </div>
      </div>

      {/* Bottom Anchored Player */}
      <div className="w-full max-w-xl z-20 pointer-events-auto pb-[max(1rem,env(safe-area-inset-bottom))] px-[max(1rem,env(safe-area-inset-left))] flex flex-col items-center">
        <MusicPlayer playlist={currentPlaylist} />

        <div className="mt-2.5 flex items-center justify-between w-full max-w-xl px-4 text-[10px] font-mono text-white/40 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-400/80" />
            <span>UK 04 TA 2015</span>
          </div>
          <span>UTTARAKHAND PARIVAHAN</span>
          <span>DEVBHUMI LIVE</span>
        </div>
      </div>
    </>
  );
}
