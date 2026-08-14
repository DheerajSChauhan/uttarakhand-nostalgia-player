import { ClientApp } from "@/components/ClientApp";

export default function Page() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden select-none">
      {/* 1. Fixed background div, -z-20, class hero-bg, bg-cover bg-center with gradient overlay */}
      <div className="fixed inset-0 -z-20 hero-bg bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* 2. Fixed grain overlay, -z-10: inline SVG feTurbulence data-URI */}
      <div
        className="fixed inset-0 -z-10 grain-overlay pointer-events-none"
        aria-hidden="true"
      />

      {/* 3 & 4. Fixed Top Row & Bottom-Anchored Centerpiece Player */}
      <ClientApp />
    </main>
  );
}
