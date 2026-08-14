export interface Track {
  id: string;
  title: string;
  artist: string;
  film?: string;
  year?: string | number;
  duration: number; // duration in seconds
  videoId: string;
}

export type PlaylistSource = "tracks" | "youtube-playlist";

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tagline: string;
  source?: PlaylistSource;
  youtubePlaylistId?: string;
  tracks: Track[];
}
