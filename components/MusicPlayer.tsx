"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { Track, Playlist } from "@/lib/types";
import { trackPlayerError, trackSongPlay } from "@/lib/analytics";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

// -----------------------------------------------------------------------------
// MODULE-SCOPE UTILITY FUNCTIONS
// -----------------------------------------------------------------------------
function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// -----------------------------------------------------------------------------
// MODULE-SCOPE SUB-COMPONENTS
// -----------------------------------------------------------------------------

const SpindleHole = memo(function SpindleHole() {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black/90 ring-2 ring-white/50 pointer-events-none z-20 shadow-sm"
      aria-hidden="true"
    />
  );
});

const VinylGrooves = memo(function VinylGrooves() {
  return (
    <div
      className="absolute inset-0 rounded-full vinyl-grooves opacity-70 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
});

interface VinylSlotProps {
  size: "desktop" | "mobile";
  isPlaying: boolean;
  artistName: string;
}

const VinylArtwork = memo(function VinylArtwork({
  size,
  isPlaying,
  artistName,
}: VinylSlotProps) {
  const dimensionClass = size === "desktop" ? "w-20 h-20" : "w-16 h-16";

  return (
    <div className="relative group flex-shrink-0 select-none">
      <div
        className={`${dimensionClass} relative rounded-full overflow-hidden border border-white/15 bg-neutral-950 shadow-xl flex items-center justify-center transition-transform active:scale-95`}
        style={{
          boxShadow: "0 8px 24px -4px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.2)",
        }}
      >
        <div
          className={`w-full h-full relative rounded-full overflow-hidden flex items-center justify-center animate-spin-vinyl ${
            isPlaying ? "" : "paused"
          }`}
          style={{
            animationPlayState: isPlaying ? "running" : "paused",
          }}
        >
          {/* Cover Art Artwork Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85 scale-110"
            style={{ backgroundImage: "url('/bg/scene-wide.png')" }}
          />

          <VinylGrooves />

          {/* Center Vinyl Record Label */}
          <div className="absolute inset-[24%] rounded-full bg-gradient-to-tr from-amber-600/90 via-amber-500/90 to-amber-700/90 border border-white/40 flex items-center justify-center pointer-events-none z-10 shadow-inner">
            <span className="text-[7.5px] font-mono font-bold tracking-tighter text-black/90 uppercase text-center px-1 truncate">
              {(artistName || "Devbhoomi").slice(0, 10)}
            </span>
          </div>

          <SpindleHole />
        </div>
      </div>
    </div>
  );
});

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const SeekBar = memo(function SeekBar({ currentTime, duration, onSeek }: SeekBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubProgress, setScrubProgress] = useState<number | null>(null);

  const currentPercent =
    duration > 0
      ? Math.min(100, Math.max(0, ((scrubProgress ?? currentTime) / duration) * 100))
      : 0;

  const calculateSeekTime = useCallback(
    (clientX: number): number => {
      if (!barRef.current || duration <= 0) return 0;
      const rect = barRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      return ratio * duration;
    },
    [duration]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsScrubbing(true);
      const targetTime = calculateSeekTime(e.clientX);
      setScrubProgress(targetTime);

      const onPointerMove = (moveEvent: PointerEvent) => {
        const moveTime = calculateSeekTime(moveEvent.clientX);
        setScrubProgress(moveTime);
      };

      const onPointerUp = (upEvent: PointerEvent) => {
        const finalTime = calculateSeekTime(upEvent.clientX);
        setIsScrubbing(false);
        setScrubProgress(null);
        onSeek(finalTime);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [calculateSeekTime, onSeek]
  );

  return (
    <div
      ref={barRef}
      onPointerDown={handlePointerDown}
      className="group relative flex items-center h-6 w-full cursor-pointer touch-none select-none py-2"
      role="slider"
      aria-label="Seek track position"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      tabIndex={0}
    >
      <div className="relative w-full h-[3px] rounded-full bg-white/15 overflow-visible">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-amber-400 transition-all duration-75"
          style={{
            width: `${currentPercent}%`,
            boxShadow: "0 0 10px rgba(245, 158, 11, 0.65), 0 0 4px rgba(251, 191, 36, 0.8)",
          }}
        />

        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white ring-2 ring-amber-400/60 shadow-md transition-opacity duration-150 pointer-events-none ${
            isScrubbing ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{ left: `${currentPercent}%` }}
        />
      </div>
    </div>
  );
});

interface TrackInfoProps {
  title: string;
  artist: string;
  film?: string;
  year?: string | number;
  isBuffering?: boolean;
}

const TrackInfo = memo(function TrackInfo({
  title,
  artist,
  film,
  year,
  isBuffering,
}: TrackInfoProps) {
  return (
    <div className="flex flex-col min-w-0 flex-1">
      <div className="flex items-center gap-1.5 min-w-0">
        <h2 className="text-[15px] font-semibold text-white tracking-tight truncate">
          {title}
        </h2>
        {isBuffering && (
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
        )}
      </div>
      <p className="text-[12.5px] text-white/70 tracking-normal truncate">
        {artist}
        {film && <span className="text-white/40"> • {film}</span>}
        {year && <span className="text-white/40"> ({year})</span>}
      </p>
    </div>
  );
});

interface TimeStampProps {
  currentTime: number;
  duration: number;
}

const TimeStamp = memo(function TimeStamp({ currentTime, duration }: TimeStampProps) {
  return (
    <div className="flex items-center gap-1 font-mono text-[10.5px] tabular-nums text-white/70 select-none flex-shrink-0">
      <span>{formatTime(currentTime)}</span>
      <span className="text-white/30">/</span>
      <span>{formatTime(duration)}</span>
    </div>
  );
});

interface TransportProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  isMobile?: boolean;
}

const TransportButtons = memo(function TransportButtons({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  isMuted,
  onToggleMute,
  isMobile = false,
}: TransportProps) {
  const buttonTouchClass = isMobile
    ? "min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-full"
    : "p-2 rounded-full";

  return (
    <div className="flex items-center gap-2 select-none">
      <button
        type="button"
        onClick={onPrev}
        className={`${buttonTouchClass} text-white/70 hover:text-white hover:bg-white/10 active:scale-90 transition-all`}
        aria-label="Previous Track"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onPlayPause}
        className={`${
          isMobile ? "w-[52px] h-[52px]" : "w-11 h-11"
        } rounded-full bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black ring-1 ring-white/25 active:scale-95 transition-all flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(245,158,11,0.5)] flex-shrink-0`}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={onNext}
        className={`${buttonTouchClass} text-white/70 hover:text-white hover:bg-white/10 active:scale-90 transition-all`}
        aria-label="Next Track"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>

      {onToggleMute && (
        <button
          type="button"
          onClick={onToggleMute}
          className={`${buttonTouchClass} text-white/60 hover:text-white hover:bg-white/10 transition-all hidden sm:flex`}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
});

// -----------------------------------------------------------------------------
// MAIN MUSIC PLAYER CONTAINER
// -----------------------------------------------------------------------------
interface MusicPlayerProps {
  playlist: Playlist;
}

export function MusicPlayer({ playlist }: MusicPlayerProps) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Live metadata extracted dynamically from YouTube queue
  const [liveYtMeta, setLiveYtMeta] = useState<{ title: string; artist: string; videoId?: string }>({
    title: playlist.name,
    artist: playlist.tagline,
  });

  const playerRef = useRef<any>(null);
  const isPlayerReadyRef = useRef(false);
  const playlistRef = useRef<Playlist>(playlist);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keep latest playlist in ref for async callbacks
  playlistRef.current = playlist;

  const currentTrack: Track = playlist.source === "youtube-playlist"
    ? {
        id: `yt-live-${trackIndex}`,
        title: liveYtMeta.title || playlist.name,
        artist: liveYtMeta.artist || "Devbhoomi Radio",
        duration: duration || 240,
        videoId: liveYtMeta.videoId || playlist.youtubePlaylistId || "",
      }
    : playlist.tracks[trackIndex] || playlist.tracks[0] || {
        id: "placeholder",
        title: playlist.name,
        artist: playlist.tagline,
        duration: 180,
        videoId: "",
      };

  const mountId = "yt-player-mount";

  // Query metadata from YouTube player
  const syncLiveMetadata = useCallback(() => {
    if (!playerRef.current) return;
    try {
      if (typeof playerRef.current.getVideoData === "function") {
        const data = playerRef.current.getVideoData();
        if (data && data.title) {
          setLiveYtMeta({
            title: data.title,
            artist: data.author || playlistRef.current.name,
            videoId: data.video_id,
          });
        }
      }
      const dur = playerRef.current.getDuration();
      if (dur && dur > 0) {
        setDuration(dur);
      }
    } catch (e) {
      console.debug("Could not sync metadata", e);
    }
  }, []);

  // Handle Next Track
  const handleNextTrack = useCallback(() => {
    if (playlistRef.current.source === "youtube-playlist" && playerRef.current && typeof playerRef.current.nextVideo === "function") {
      playerRef.current.nextVideo();
      setTimeout(syncLiveMetadata, 400);
      return;
    }

    if (playlistRef.current.tracks.length > 0) {
      setTrackIndex((prev) => {
        const nextIndex = (prev + 1) % playlistRef.current.tracks.length;
        const nextTrack = playlistRef.current.tracks[nextIndex];
        setCurrentTime(0);
        setDuration(nextTrack.duration || 180);

        if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
          playerRef.current.loadVideoById(nextTrack.videoId);
          trackSongPlay(nextTrack);
        }
        return nextIndex;
      });
    }
  }, [syncLiveMetadata]);

  // Handle Prev Track
  const handlePrevTrack = useCallback(() => {
    if (playlistRef.current.source === "youtube-playlist" && playerRef.current && typeof playerRef.current.previousVideo === "function") {
      playerRef.current.previousVideo();
      setTimeout(syncLiveMetadata, 400);
      return;
    }

    if (playlistRef.current.tracks.length > 0) {
      setTrackIndex((prev) => {
        const prevIndex = (prev - 1 + playlistRef.current.tracks.length) % playlistRef.current.tracks.length;
        const targetTrack = playlistRef.current.tracks[prevIndex];
        setCurrentTime(0);
        setDuration(targetTrack.duration || 180);

        if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
          playerRef.current.loadVideoById(targetTrack.videoId);
          trackSongPlay(targetTrack);
        }
        return prevIndex;
      });
    }
  }, [syncLiveMetadata]);

  // Initialize YT Player Instance
  const initPlayer = useCallback(() => {
    if (!window.YT || !window.YT.Player) return;

    try {
      const activePlaylist = playlistRef.current;
      playerRef.current = new window.YT.Player(mountId, {
        height: "200",
        width: "200",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: typeof window !== "undefined" ? window.location.origin : "",
        },
        events: {
          onReady: (event: any) => {
            isPlayerReadyRef.current = true;
            if (activePlaylist.source === "youtube-playlist" && activePlaylist.youtubePlaylistId) {
              event.target.cuePlaylist({
                list: activePlaylist.youtubePlaylistId,
                listType: "playlist",
                index: 0,
              });
            }
            syncLiveMetadata();
          },
          onStateChange: (event: any) => {
            // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING, 5: CUED, -1: UNSTARTED
            if (event.data === 1) {
              setIsPlaying(true);
              setIsBuffering(false);
              syncLiveMetadata();
            } else if (event.data === 2) {
              setIsPlaying(false);
              setIsBuffering(false);
            } else if (event.data === 0) {
              handleNextTrack();
            } else if (event.data === 3) {
              setIsBuffering(true);
              syncLiveMetadata();
            } else if (event.data === 5 || event.data === -1) {
              syncLiveMetadata();
            }
          },
          onError: (event: any) => {
            trackPlayerError(event.data, activePlaylist.youtubePlaylistId || "error", activePlaylist.name);
            handleNextTrack();
          },
        },
      });
    } catch (err) {
      console.error("YT Player init error:", err);
    }
  }, [syncLiveMetadata, handleNextTrack]);

  // Load YouTube IFrame API on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onYouTubeReady = () => {
      if (document.getElementById(mountId) && !playerRef.current) {
        initPlayer();
      }
    };

    if (window.YT && window.YT.Player) {
      onYouTubeReady();
    } else {
      window.onYouTubeIframeAPIReady = onYouTubeReady;
      const scriptTag = document.createElement("script");
      scriptTag.src = "https://www.youtube.com/iframe_api";
      scriptTag.async = true;
      document.body.appendChild(scriptTag);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [initPlayer]);

  // Handle Playlist Switch Immediately and Smoothly
  useEffect(() => {
    setTrackIndex(0);
    setCurrentTime(0);
    setLiveYtMeta({ title: playlist.name, artist: playlist.tagline });

    if (playerRef.current && isPlayerReadyRef.current) {
      if (playlist.source === "youtube-playlist" && playlist.youtubePlaylistId) {
        try {
          playerRef.current.loadPlaylist({
            list: playlist.youtubePlaylistId,
            listType: "playlist",
            index: 0,
            startSeconds: 0,
          });
          setIsPlaying(true);
          setTimeout(syncLiveMetadata, 400);
        } catch (e) {
          console.error("Failed to load playlist:", e);
        }
      } else if (playlist.tracks.length > 0) {
        setDuration(playlist.tracks[0]?.duration || 180);
        try {
          playerRef.current.loadVideoById(playlist.tracks[0]?.videoId);
          setIsPlaying(true);
          trackSongPlay(playlist.tracks[0]);
        } catch (e) {
          console.error("Failed to load video:", e);
        }
      }
    }
  }, [playlist, syncLiveMetadata]);

  // Progress polling during playback
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
          const current = playerRef.current.getCurrentTime();
          setCurrentTime(current || 0);
          const dur = playerRef.current.getDuration();
          if (dur && dur > 0 && dur !== duration) {
            setDuration(dur);
          }
        }
      }, 400);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  // Direct User Play/Pause
  const handlePlayPause = useCallback(() => {
    if (!playerRef.current) {
      if (window.YT && window.YT.Player) {
        initPlayer();
        setIsPlaying(true);
      }
      return;
    }

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      if (playlist.source === "youtube-playlist" && playlist.youtubePlaylistId) {
        const state = playerRef.current.getPlayerState?.();
        if (state === -1 || state === 5 || state === undefined) {
          playerRef.current.loadPlaylist({
            list: playlist.youtubePlaylistId,
            listType: "playlist",
            index: 0,
            startSeconds: 0,
          });
        } else {
          playerRef.current.playVideo();
        }
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(true);
      trackSongPlay(currentTrack);
    }
  }, [isPlaying, currentTrack, playlist, initPlayer]);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(time, true);
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  }, [isMuted]);

  const displayTitle = playlist.source === "youtube-playlist" ? liveYtMeta.title : currentTrack.title;
  const displayArtist = playlist.source === "youtube-playlist" ? liveYtMeta.artist : currentTrack.artist;

  return (
    <>
      {/* Active YouTube Audio Engine Mount (Rendered behind player without viewport throttling) */}
      <div
        className="fixed bottom-0 left-0 w-[200px] h-[200px] -z-50 opacity-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div id={mountId} />
      </div>

      {/* Desktop Layout: Horizontal Pill */}
      <div className="hidden sm:flex items-center gap-4 w-full max-w-xl rounded-full p-3 pr-5 glass-panel transition-all duration-300">
        <VinylArtwork
          size="desktop"
          isPlaying={isPlaying}
          artistName={displayArtist}
        />

        <div className="flex flex-col flex-1 min-w-0 justify-center gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <TrackInfo
              title={displayTitle}
              artist={displayArtist}
              film={currentTrack.film}
              year={currentTrack.year}
              isBuffering={isBuffering}
            />
            <TimeStamp currentTime={currentTime} duration={duration} />
          </div>

          <SeekBar currentTime={currentTime} duration={duration} onSeek={handleSeek} />
        </div>

        <TransportButtons
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onPrev={handlePrevTrack}
          onNext={handleNextTrack}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isMobile={false}
        />
      </div>

      {/* Mobile Layout: Stacked Card */}
      <div className="flex sm:hidden flex-col gap-3 w-full max-w-sm rounded-[26px] p-4 glass-panel transition-all duration-300">
        <div className="flex items-center gap-3.5 min-w-0">
          <VinylArtwork
            size="mobile"
            isPlaying={isPlaying}
            artistName={displayArtist}
          />
          <TrackInfo
            title={displayTitle}
            artist={displayArtist}
            film={currentTrack.film}
            year={currentTrack.year}
            isBuffering={isBuffering}
          />
        </div>

        <div className="w-full">
          <SeekBar currentTime={currentTime} duration={duration} onSeek={handleSeek} />
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <TimeStamp currentTime={currentTime} duration={duration} />

          <div className="flex-1 flex justify-center pr-4">
            <TransportButtons
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onPrev={handlePrevTrack}
              onNext={handleNextTrack}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              isMobile={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
