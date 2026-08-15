import { ClientApp } from "@/components/ClientApp";

export default function Page() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden select-none">
      {/* Fixed grain overlay: inline SVG feTurbulence data-URI */}
      <div
        className="fixed inset-0 -z-10 grain-overlay pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Client Orchestrator with Smooth Animated Backgrounds */}
      <ClientApp />
    </main>
  );
}
