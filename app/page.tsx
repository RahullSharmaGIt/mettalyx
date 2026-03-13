import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { HeroSection } from "@/components/landing/hero";
import { NetworkStats } from "@/components/landing/network-stats";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MachineRoom } from "@/components/landing/machine-room";
import { TrustPillars } from "@/components/landing/trust-pillars";
import { FoundersPledge } from "@/components/landing/founders-pledge";
import ManufacturingServicesSection from "@/components/landing/ManufacturingServicesSection";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  // Route protection logic (Redirects to dashboards if logged in)
  if (session?.user) {
    if (session.user.role === "VENDOR") {
      redirect("/vendor/jobs");
    } else if (session.user.role === "OEM") {
      redirect("/oem/dashboard");
    } else if (session.user.role === "ADMIN") {
      redirect("/admin/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-industrial-bg font-sans selection:bg-industrial-orange selection:text-industrial-text">

      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-industrial-bg border-b-2 border-industrial-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Element */}
          <div className="w-8 h-8 bg-industrial-text flex items-center justify-center border-2 border-industrial-border rotate-3 cursor-pointer">
            <span className="text-white font-black leading-none">M</span>
          </div>
          <span className="text-xl font-black uppercase tracking-tighter text-industrial-text">METALLYX</span>
        </div>

        <div className="flex gap-4">
          <Link href="/auth/login" className="hidden sm:inline-block px-5 py-2 font-bold text-industrial-text uppercase text-sm border-2 border-transparent hover:border-industrial-border transition-colors">
            Sign In
          </Link>
          <Link href="/auth/register?role=oem" className="px-5 py-2 bg-industrial-orange text-industrial-text font-bold uppercase text-sm border-2 border-industrial-border hover:-translate-y-1 hover:shadow-neo transition-all">
            Get a Quote
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <HeroSection />



      {/* Live Stats Ribbon */}
      <NetworkStats />

      {/* Manufacturing Services Section */}
      <ManufacturingServicesSection />

      {/* Blueprint to Part Steps */}
      <HowItWorks />

      {/* The Machine Room / Bento Grid */}
      <MachineRoom />

      {/* Trust Pillars */}
      <TrustPillars />

      {/* Founders Pledge Signature Section */}
      <FoundersPledge />

      {/* Minimal Footer */}
      <footer className="bg-slate-900 text-white py-12 text-center border-t-2 border-slate-900">
        <div className="font-mono text-sm uppercase text-slate-500 mb-4">
          Metallyx Logistics & Manufacturing
        </div>
        <p className="font-bold" suppressHydrationWarning>© {new Date().getFullYear()} METALLYX INC. ALL RIGHTS RESERVED.</p>
      </footer>
    </main>
  );
}
