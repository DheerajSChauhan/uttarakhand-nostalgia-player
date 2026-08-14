import { track } from "@vercel/analytics";

export function trackPlayerError(errorCode: number | string, videoId: string, trackTitle?: string) {
  try {
    track("player_playback_error", {
      errorCode: String(errorCode),
      videoId,
      trackTitle: trackTitle || "unknown",
      timestamp: new Date().toISOString(),
    });
    console.warn(`[Player Analytics] Error ${errorCode} on video: ${videoId} (${trackTitle})`);
  } catch (err) {
    console.error("[Player Analytics] Failed to send error event:", err);
  }
}

export function trackSongPlay(trackItem: { id: string; title: string; artist: string; videoId: string }) {
  try {
    track("song_play", {
      trackId: trackItem.id,
      title: trackItem.title,
      artist: trackItem.artist,
      videoId: trackItem.videoId,
    });
  } catch (err) {
    // Analytics failure shouldn't disrupt playback
    console.debug("[Player Analytics] Track play skipped:", err);
  }
}

export function trackPlaylistChange(playlistId: string, playlistName: string) {
  try {
    track("playlist_change", {
      playlistId,
      playlistName,
    });
  } catch (err) {
    console.debug("[Player Analytics] Playlist change track skipped:", err);
  }
}
