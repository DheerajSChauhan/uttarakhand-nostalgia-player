# 🏔️ Devbhoomi Radio — Uttarakhand Nostalgia Player (देवभूमि Radio)

[![Live Demo](https://img.shields.io/badge/Live_Demo-pahadiradio.vercel.app-f59e0b?style=for-the-badge&logo=vercel&logoColor=white)](https://pahadiradio.vercel.app)
[![Next.js 15](https://img.shields.io/badge/Next.js_15-App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-Theme_Tokens-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Meta Pixel](https://img.shields.io/badge/Meta_Pixel-1034347962564398-1877F2?style=for-the-badge&logo=meta)](https://business.facebook.com/)

A single-page nostalgia music web experience dedicated to the timeless melodies and serpentine mountain roads of **Uttarakhand (Devbhoomi)**.

Step into the iconic white Bolero taxi cruising the pine-scented curves of NH-309 through Almora, Kausani, and Bageshwar. Watch the vinyl record spin against majestic Himalayan peaks while listening to authentic folk and vintage mountain melodies.

---

## 🌟 Live Demo

👉 **[https://pahadiradio.vercel.app](https://pahadiradio.vercel.app)**

---

## ✨ Features

### 🎧 Floating Glassmorphic Audio Player
- **Desktop Layout (`hidden sm:flex`)**: Floating glass pill (`rounded-full p-3 pr-5`) containing:
  - 80px spinning vinyl record with grooved radial styling and centered 12px spindle hole.
  - Truncated live track title and artist name.
  - 24px invisible touch hit-area seek bar with a 3px glowing amber rail.
  - Tabular-nums timestamp (`elapsed / duration`).
  - Transport controls (Previous, Play/Pause, Next, and Mute/Unmute).
- **Mobile Layout (`sm:hidden`)**: Stacked glass card (`rounded-[26px] p-4`) containing:
  - 64px spinning vinyl record + track info.
  - Full-width touch-friendly seek bar (`touch-none` with `onPointerDown`).
  - 52px amber gradient circular play button with coloured drop shadow and ≥44px minimum touch targets.
- **Pure Audio Focus**: Features cover artwork within the spinning vinyl with background YouTube audio streaming.

### 👥 Real-Time Concurrent Listener Counter
- **Real-Time Presence API (`/api/listeners`)**: Uses lightweight heartbeat pings (`POST /api/listeners`) every 10 seconds to track active browser sessions in real time.
- **Immediate Disconnect**: Sends a `sendBeacon` on tab close/unload to automatically decrement the count.
- **Live Badge**: Shows exact live visitor count (e.g. `1 wandering`, `5 wandering`) in the top center bar.

### 🖼️ Responsive Mountain Artwork & Atmosphere
- **Adaptive Scene**:
  - Landscape image (`scene-wide.png`) rendered for desktop viewports.
  - Portrait image (`scene-tall.png`) dynamically swapped on mobile via `@media (orientation: portrait)`.
- **Film Grain & Vignette**: Inline SVG `feTurbulence` grain overlay (`mix-blend-mode: overlay`, `opacity: 0.3`) combined with a vertical gradient vignette.
- **Safe Area Insets**: All corner components respect `max(1rem, env(safe-area-inset-*))` and `viewportFit: "cover"`.

### ⏰ Live Almora (IST) Clock
- Formatted with `Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", ... })`.
- Live pulsing colon indicator via CSS `@keyframes blink`.

### 📻 Curated Mountain Frequencies
Listeners can switch between live YouTube Music playlist channels in the top-right corner:
1. **Devbhoomi Nostalgia Radio** (Default) — `PLAjHrQ1Nk_uM`
2. **Most viewed Uttarakhandi songs** — `PLMzZ6O7pRV98`

### 📊 Integrated Analytics & Tracking
- **Meta Pixel**: Integrated with Pixel ID `1034347962564398` using Next.js `afterInteractive` script strategy and noscript fallback.
- **Vercel Analytics & Speed Insights**: Real-time Core Web Vitals monitoring.

---

## 🏗️ Project Architecture

```
musicPlayer/
├── app/
│   ├── api/
│   │   └── listeners/
│   │       └── route.ts          # Real-time listener heartbeat presence API
│   ├── favicon.ico               # 3D Avatar browser icon
│   ├── globals.css               # Tailwind CSS v4 @theme tokens, glass styles & keyframes
│   ├── icon.png                  # High-res tab icon
│   ├── layout.tsx                # Server root layout, viewportFit, Meta Pixel & SEO
│   └── page.tsx                  # Server component layout with background & grain
├── components/
│   ├── ClientApp.tsx             # Client orchestrator for state & playlists
│   ├── LiveClock.tsx             # Asia/Kolkata live clock with blinking colon
│   ├── MusicPlayer.tsx           # Floating glass vinyl player & YouTube IFrame engine
│   └── TopBar.tsx                # Header with live clock, station badge & frequencies
├── lib/
│   ├── analytics.ts              # Playback tracking & error logging
│   ├── playlistParser.ts         # YouTube URL/ID parser helper
│   ├── tracks.ts                 # Curated playlist definitions
│   ├── types.ts                  # TypeScript interfaces for tracks and playlists
│   └── useLiveListeners.ts       # React hook for real-time presence heartbeats
├── public/
│   ├── bg/
│   │   ├── scene-tall.png        # Mobile portrait background (576x1024)
│   │   └── scene-wide.png        # Desktop landscape background (1024x576)
│   ├── favicon.ico
│   └── icon.png
├── next.config.ts                # Next.js configuration (devIndicators disabled)
├── package.json
├── postcss.config.mjs            # PostCSS plugin for Tailwind CSS v4
├── README.md
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **npm**: v9+

### 1. Clone the Repository

```bash
git clone https://github.com/DheerajSChauhan/uttarakhand-nostalgia-player.git
cd uttarakhand-nostalgia-player
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## ⚙️ Customization

### Adding or Changing YouTube Playlists
Open [`lib/tracks.ts`](file:///c:/dsc_stuff/musicPlayer/lib/tracks.ts) to edit or add new radio channels:

```typescript
export const PLAYLISTS: Playlist[] = [
  {
    id: "my-playlist",
    name: "My Custom Radio Channel",
    tagline: "Atmospheric hill station roadtrip vibes",
    description: "Classic acoustic melodies and scenic serenity.",
    source: "youtube-playlist",
    youtubePlaylistId: "YOUR_YOUTUBE_PLAYLIST_ID", // e.g. PLAjHrQ1Nk_uM
    tracks: [],
  },
];
```

### Updating the Meta Pixel ID
Open [`app/layout.tsx`](file:///c:/dsc_stuff/musicPlayer/app/layout.tsx) and replace `1034347962564398` with your Meta Pixel ID.

### Customizing Background Visuals
Replace the two images in [`public/bg/`](file:///c:/dsc_stuff/musicPlayer/public/bg/):
- `scene-wide.png` — Landscape (16:9 ratio, e.g. 1024×576 or 1920×1080)
- `scene-tall.png` — Portrait (9:16 ratio, e.g. 576×1024 or 1080×1920)

---

## 🚢 Deployment (Vercel)

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Import Project"**.
3. Select `uttarakhand-nostalgia-player` and click **"Deploy"**.
4. To configure a custom domain (e.g. `pahadiradio.vercel.app`):
   - Go to **Project Settings** → **Domains**.
   - Enter your desired domain and click **Add**.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ for Uttarakhand and lovers of Himalayan music.
