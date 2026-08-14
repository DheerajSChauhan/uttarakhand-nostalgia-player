# 🏔️ Devbhoomi Nostalgia Player (देवभूमि Airwaves)

A single-page nostalgia music web experience built with **Next.js (App Router)**, **Tailwind CSS v4**, and the **YouTube IFrame Player API**.

Experience the scenic mountain roads of Uttarakhand along NH-309 with a white Bolero taxi, ambient live IST clock, and a floating glassmorphic audio player spinning timeless mountain melodies.

---

## ✨ Features

- **Floating Glassmorphic Audio Player**:
  - **Desktop**: Pill layout with an 80px spinning vinyl record, spindle hole, glowing seek bar, and tabular timestamps.
  - **Mobile**: Stacked glass card with 64px vinyl and touch-friendly controls (≥44px touch targets).
- **YouTube Live Stream Queue**:
  - Streams directly from YouTube Music playlists.
  - Dynamically extracts real-time track metadata (song title & artist).
  - Automatically advances through the queue on track finish.
- **Scenic Responsive Visuals**:
  - Adaptive background: Landscape (`scene-wide.png`) for desktop, portrait (`scene-tall.png`) for mobile.
  - SVG `feTurbulence` grain overlay + vertical gradient depth.
- **Live Almora Clock**:
  - Formatted in `Asia/Kolkata` with a ticking blinking colon.
- **Multi-Channel Frequencies**:
  - **Devbhoomi Nostalgia Radio** (`PLAjHrQ1Nk_uM`)
  - **Most viewed Uttarakhandi songs** (`PLMzZ6O7pRV98`)
- **Meta Pixel Tracking**:
  - Pixel ID `1034347962564398` integrated with Next.js Script strategy.

---

## 🛠️ Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@theme` tokens in `app/globals.css`
- **Analytics**: `@vercel/analytics` & `@vercel/speed-insights`
- **Audio Engine**: YouTube IFrame Player API

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/DheerajSChauhan/uttarakhand-nostalgia-player.git
cd uttarakhand-nostalgia-player
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build

```bash
npm run build
npm run start
```

---

## 📻 Adding / Changing Playlists

To add or update playlists, edit `lib/tracks.ts`:

```typescript
{
  id: "my-playlist",
  name: "My Mountain Mix",
  tagline: "Custom playlist description",
  description: "Description of the vibe",
  source: "youtube-playlist",
  youtubePlaylistId: "YOUR_PLAYLIST_ID",
  tracks: []
}
```
