import { Playlist } from "./types";

export function parsePlaylistInput(
  input: string,
  name?: string,
  description?: string
): Playlist | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Check for YouTube Playlist URL or raw PL ID
  const ytPlaylistMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/i);
  if (ytPlaylistMatch || trimmed.startsWith("PL") || trimmed.startsWith("RD") || trimmed.startsWith("OLAK5uy_")) {
    const ytPlaylistId = ytPlaylistMatch ? ytPlaylistMatch[1] : trimmed;
    return {
      id: `custom-yt-${Date.now()}`,
      name: name || "Custom YouTube Radio",
      tagline: "Direct YouTube Playlist Stream",
      description: description || "Custom YouTube playlist queue added by listener.",
      source: "youtube-playlist",
      youtubePlaylistId: ytPlaylistId,
      tracks: [],
    };
  }

  // 2. Check for single YouTube Video URL or Video ID
  const ytVideoMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/i);
  if (ytVideoMatch) {
    const videoId = ytVideoMatch[1];
    return {
      id: `custom-yt-song-${Date.now()}`,
      name: name || "Custom YouTube Track",
      tagline: "Single stream via YouTube",
      description: description || "Custom track stream added by listener.",
      source: "tracks",
      tracks: [
        {
          id: `track-${Date.now()}`,
          title: name || "Custom YouTube Audio",
          artist: "Live Stream",
          film: "Devbhoomi",
          year: new Date().getFullYear(),
          duration: 240,
          videoId,
        },
      ],
    };
  }

  // Default fallback: treat as YouTube Playlist ID
  return {
    id: `custom-yt-${Date.now()}`,
    name: name || "Custom YouTube Channel",
    tagline: "Direct YouTube Stream",
    description: description || "Custom YouTube playlist stream.",
    source: "youtube-playlist",
    youtubePlaylistId: trimmed,
    tracks: [],
  };
}
