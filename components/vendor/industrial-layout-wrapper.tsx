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
        <div className="flex min-h-screen bg-slate-50/50">
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

                <footer className="px-8 py-6 border-t border-slate-200 bg-white">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
                        <div className="flex gap-6">
                            <span>Version 4.8.2</span>
                            <span>Region: EU-WEST-1</span>
                            <span>Enterprise: {vendorName}</span>
                        </div>
                        <div className="text-slate-900 font-semibold text-xs tracking-tight">
                            METALLYX
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
