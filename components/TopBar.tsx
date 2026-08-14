"use client";

import { useState } from "react";
import { LiveClock } from "./LiveClock";
import { Playlist } from "@/lib/types";

interface TopBarProps {
  playlists: Playlist[];
  currentPlaylist: Playlist;
  onSelectPlaylist?: (playlist: Playlist) => void;
  listenerCount?: number;
}

export function TopBar({
  playlists,
  currentPlaylist,
  onSelectPlaylist,
  listenerCount = 42,
}: TopBarProps) {
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none w-full">
      {/* Top Left: Live Almora Clock */}
      <div className="absolute top-[max(1rem,env(safe-area-inset-top))] left-[max(1rem,env(safe-area-inset-left))] pointer-events-auto">
        <LiveClock />
      </div>

      {/* Top Centre: Live Mountain Radio Status */}
      <div className="absolute top-[max(1rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 pointer-events-auto hidden md:block">
        <div className="glass-pill-subtle flex items-center gap-2 rounded-full px-4 py-1.5 shadow-lg border border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
            Devbhoomi Airwaves
          </span>
          <span className="text-white/30">•</span>
          <span className="text-[11px] font-mono text-amber-300/90 font-medium">
            {listenerCount} wandering
          </span>
          <span className="text-white/30">•</span>
          <span className="text-[10.5px] text-white/60 tracking-tight">NH-309 Bolero</span>
        </div>
      </div>

      {/* Top Right: Current Station & Info */}
      <div className="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] pointer-events-auto flex items-center gap-2">
        {/* Station Pill */}
        <div className="relative">
          <button
            onClick={() => {
              if (playlists.length > 1) {
                setShowPlaylistMenu(!showPlaylistMenu);
              } else {
                setShowAboutModal(true);
              }
            }}
            type="button"
            className="glass-pill-subtle flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-white/90 shadow-lg transition-all hover:bg-white/15 hover:border-white/20 active:scale-95"
            aria-label="Radio Station"
          >
            <svg
              className="w-3.5 h-3.5 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <span className="font-medium text-[11.5px] max-w-[120px] sm:max-w-[180px] truncate">
              {currentPlaylist.name}
            </span>
            {playlists.length > 1 && (
              <svg
                className={`w-3 h-3 text-white/50 transition-transform duration-200 ${
                  showPlaylistMenu ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {/* Playlist Dropdown (if multiple) */}
          {showPlaylistMenu && playlists.length > 1 && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/20"
                onClick={() => setShowPlaylistMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel p-2 z-50 shadow-2xl border border-white/15 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-150 max-h-[70vh] overflow-y-auto">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                    Radio Frequency
                  </p>
                  <p className="text-[11px] text-white/60">Live Mountain Airwaves</p>
                </div>
                <div className="mt-1 space-y-1">
                  {playlists.map((playlist) => {
                    const isSelected = playlist.id === currentPlaylist.id;

                    return (
                      <button
                        key={playlist.id}
                        type="button"
                        onClick={() => {
                          if (onSelectPlaylist) onSelectPlaylist(playlist);
                          setShowPlaylistMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? "bg-amber-500/20 text-white border border-amber-500/40"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                            isSelected ? "bg-amber-400 animate-pulse" : "bg-white/20"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{playlist.name}</p>
                          <p className="text-[10px] text-white/50 line-clamp-1">
                            {playlist.tagline}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Info & Story Trigger */}
        <button
          onClick={() => setShowAboutModal(true)}
          type="button"
          className="glass-pill-subtle p-2 rounded-full text-white/80 hover:text-white hover:bg-white/15 hover:border-white/20 shadow-lg active:scale-95 transition-all"
          title="About the Roadtrip"
          aria-label="About"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pointer-events-auto">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/20 relative">
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Devbhoomi Nostalgia</h3>
                <p className="text-xs text-amber-400 font-mono">Almora • Bageshwar • Pithoragarh</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-white/80 mb-4">
              Step into the white Bolero taxi cruising the serpentine slopes of Uttarakhand on
              NH-309. Pine scented mountain breeze, rooftop luggage carrier with vintage cassette
              player, and timeless melodies playing against snowy Himalayan peaks.
            </p>

            <div className="rounded-xl bg-black/30 p-3 border border-white/10 text-[11px] text-white/60 space-y-1.5 mb-5 font-mono">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-white/90">Kumaon Hills, Uttarakhand</span>
              </div>
              <div className="flex justify-between">
                <span>Audio Engine:</span>
                <span className="text-amber-300">YouTube Music Live Stream Queue</span>
              </div>
              <div className="flex justify-between">
                <span>Playlist:</span>
                <span className="text-white/90 truncate max-w-[180px]">PLAjHrQ1Nk_uM</span>
              </div>
              <div className="flex justify-between">
                <span>Timezone:</span>
                <span className="text-white/90">Asia/Kolkata (IST)</span>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs tracking-wide shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
            >
              Back to the Drive
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
