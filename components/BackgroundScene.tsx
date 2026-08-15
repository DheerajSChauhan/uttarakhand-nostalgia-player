"use client";

import { memo } from "react";
import { Playlist } from "@/lib/types";

interface BackgroundSceneProps {
  playlists: Playlist[];
  currentPlaylistId: string;
}

export const BackgroundScene = memo(function BackgroundScene({
  playlists,
  currentPlaylistId,
}: BackgroundSceneProps) {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-black select-none pointer-events-none">
      {playlists.map((playlist) => {
        const isActive = playlist.id === currentPlaylistId;
        const wideUrl = playlist.bgWide || "/bg/scene-wide.png";
        const tallUrl = playlist.bgTall || "/bg/scene-tall.png";

        return (
          <div
            key={playlist.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out will-change-opacity ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Desktop / Landscape Viewport Layer */}
            <div
              className="hidden [@media(orientation:landscape)]:block absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-100"
              style={{
                backgroundImage: `url(${wideUrl})`,
                transform: isActive ? "scale(1.0)" : "scale(1.04)",
              }}
            />

            {/* Mobile / Portrait Viewport Layer */}
            <div
              className="block [@media(orientation:landscape)]:hidden absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-100"
              style={{
                backgroundImage: `url(${tallUrl})`,
                transform: isActive ? "scale(1.0)" : "scale(1.04)",
              }}
            />
          </div>
        );
      })}

      {/* Atmospheric Top & Bottom Vignette Shadow */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/85 z-20 pointer-events-none" />
    </div>
  );
});
