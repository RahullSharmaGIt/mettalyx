"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { ShieldCheck, CheckCircle2, RotateCw } from "lucide-react";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}: CardWrapperProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mobile Card Styling (Hidden on Desktop) */}
      <div className="lg:hidden border-2 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] bg-white mb-6">
        <div className="h-40 bg-slate-200 relative overflow-hidden border-b-2 border-slate-900">
          <div className="absolute inset-0 bg-slate-800" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 pl-6">
            <div className="bg-orange-600 px-3 py-1 inline-block mb-1">
              <span className="text-white text-[10px] font-bold tracking-widest uppercase">Mettalyx B2B</span>
            </div>
            <h2 className="text-white text-3xl font-black tracking-tight uppercase">System Access</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-6 text-slate-800 uppercase font-bold tracking-wider text-xs">
            <span className="text-orange-900">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
            </span>
            <span>Secure Node Authentication</span>
          </div>
          {children}

          <div className="mt-8 text-center text-sm font-bold uppercase tracking-wider underline underline-offset-4 text-slate-700 hover:text-slate-900">
            <a href={backButtonHref}>{backButtonLabel}</a>
          </div>
        </div>

        <div className="border-t-2 border-slate-900 bg-slate-100 p-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            System Status: Optimal
          </div>
          <div>IP: 192.168.0.254</div>
        </div>
      </div>

      {/* Mobile Badges below card */}
      <div className="lg:hidden flex justify-center items-center gap-6 mt-8 mb-4 text-slate-500">
        <div className="flex flex-col items-center gap-1">
          <CheckCircle2 className="w-8 h-8 opacity-80" />
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">AES-256</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="w-8 h-8 opacity-80" />
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">ISO-27001</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <RotateCw className="w-8 h-8 opacity-80" />
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">2FA-Ready</span>
        </div>
      </div>

      {/* Desktop Styling (Hidden on Mobile) */}
      <div className="hidden lg:block w-full">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-1 w-8 bg-orange-600"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Secure Enterprise Access</span>
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tight text-slate-900 mb-4">{headerLabel === "Welcome back" ? "Authenticate" : "Register"}</h2>
          <p className="text-sm text-slate-600">
            {headerLabel === "Welcome back" ? "Enter your credentials to access the Mettalyx B2B Portal Node." : "Create your operator credentials to access the node."}
          </p>
        </div>

        {children}

        <div className="mt-8 text-sm font-bold uppercase tracking-wider underline underline-offset-4 text-slate-700 hover:text-slate-900 mb-8 border-b border-slate-200 pb-8">
          <a href={backButtonHref}>{backButtonLabel}</a>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1 shrink-0 rounded-full bg-emerald-100 p-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">End-to-End Encryption Active</h4>
            <p className="text-[10px] text-slate-500 mt-1">AES-256 Protocol standard applied to all portal traffic.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
