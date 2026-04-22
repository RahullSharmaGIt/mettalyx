"use client";

import { useState } from "react";
import { IndustrialSidebar } from "./industrial-sidebar";
import { IndustrialNavbar } from "./industrial-navbar";
import { cn } from "@/lib/utils";

interface IndustrialLayoutWrapperProps {
    children: React.ReactNode;
    vendorName: string;
}

export function IndustrialLayoutWrapper({
    children,
    vendorName,
}: IndustrialLayoutWrapperProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#F8F8F8]">
            <IndustrialSidebar
                isOpen={isMobileOpen}
                onClose={() => setIsMobileOpen(false)}
            />

            {/* Mobile Sidebar */}
            <IndustrialSidebar
                isOpen={isMobileOpen}
                onClose={() => setIsMobileOpen(false)}
                isMobile
            />

            <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
                <IndustrialNavbar
                    onMenuClick={() => setIsMobileOpen(true)}
                    vendorName={vendorName}
                />

                <main className="flex-1">
                    {children}
                </main>

                <footer className="p-8 border-t-2 border-slate-200 bg-white">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex gap-8">
                            <span>System Version 4.8.2</span>
                            <span>Server: EU-WEST-1</span>
                            <span>License: Enterprise-{vendorName.replace(/\s+/g, '')}</span>
                        </div>
                        <div className="text-slate-900 font-black text-xs">
                            METALLYX INDUSTRIAL
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
