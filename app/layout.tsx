import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nostalgia-music-player.vercel.app"),
  title: "Pahadi Radio — Nostalgic Mountain Melodies (देवभूमि Airwaves)",
  description:
    "A nostalgic single-page music voyage through the serpentine pine roads of Uttarakhand. Live IST clock, floating glass vinyl player, and curated mountain melodies.",
  keywords: [
    "Pahadi Radio",
    "Uttarakhand Nostalgia",
    "Mountain Music",
    "Almora",
    "Devbhoomi",
    "Bolero Taxi Music",
  ],
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Pahadi Radio — Devbhoomi Nostalgia",
    description:
      "A nostalgic single-page music voyage through the serpentine pine roads of Uttarakhand.",
    images: [
      {
        url: "/bg/scene-wide.png",
        width: 1024,
        height: 576,
        alt: "Bolero taxi driving on mountain roads of Uttarakhand",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1034347962564398');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className="antialiased bg-black text-white selection:bg-amber-500 selection:text-black">
        {/* Meta Pixel NoScript Fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1034347962564398&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
