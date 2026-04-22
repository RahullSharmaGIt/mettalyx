import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-slate-200 bg-slate-50 flex items-center justify-between px-6 lg:px-12 w-full z-10 shrink-0">
        <div className="flex items-center gap-2">
          {/* Logo placeholder - using an icon */}
          <div className="w-6 h-6 text-orange-600 flex items-center justify-center font-bold text-xl">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 2L2 22h20L12 2zm0 4l6 14H6l6-14z" />
              <path d="M12 10l-2 5h4l-2-5z" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight uppercase">Tectonic Portal</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <span>System Status: Optimal</span>
          <span>V4.0.2-Secure</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Left Side (Desktop only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-end p-16">
          {/* Background image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-0" />
          <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative z-10 space-y-6 max-w-xl">
            <div className="inline-block bg-orange-600 px-4 py-1.5">
              <span className="text-white text-xs font-bold uppercase tracking-[0.2em]">Established 1994</span>
            </div>

            <h1 className="text-white text-6xl font-black uppercase leading-[0.9] tracking-tight">
              Forging the<br />next standard.
            </h1>

            <p className="text-slate-300 text-lg max-w-md border-l-2 border-orange-600 pl-4 border-opacity-50">
              Access the integrated manufacturing node for real-time telemetry, procurement, and secure supply chain management.
            </p>
          </div>
        </div>

        {/* Right Side / Mobile Main */}
        <div className="flex-1 w-full lg:w-1/2 flex flex-col justify-between overflow-y-auto relative">
          <div className="flex-1 flex flex-col justify-center items-center p-4 lg:p-12 w-full lg:max-w-xl lg:mx-auto">
            {children}
          </div>

          <div className="hidden lg:flex mt-auto border-t border-slate-200 bg-slate-50 p-6 flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500 shrink-0 w-full">
            <div className="flex items-center gap-2">
              <span className="uppercase text-slate-900 font-extrabold tracking-widest text-sm">Tectonic Industries</span>
              <span className="hidden sm:inline">|</span>
              <span className="tracking-widest">© 2024 Secure Industrial Node</span>
            </div>
            <div className="flex items-center gap-6 tracking-widest">
              <a href="#" className="hover:text-slate-900 transition-colors">Security Protocol</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-900 transition-colors">System Status</a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="flex lg:hidden flex-col items-center justify-center p-8 bg-slate-50 gap-4 text-xs font-bold text-slate-500 text-center tracking-widest border-t border-slate-900/10">
        <span className="text-slate-900 text-lg font-black tracking-widest mb-1 uppercase">Tectonic Industries</span>
        <span className="text-orange-600">© 2024 Tectonic Industries | Secure Industrial Node</span>
        <div className="flex gap-6 mt-4 opacity-70">
          <a href="#">Security Protocol</a>
          <a href="#">Terms of Service</a>
        </div>
        <span className="mt-4 opacity-70">System Status</span>
      </div>
    </div>
  );
};
export default AuthLayout;
