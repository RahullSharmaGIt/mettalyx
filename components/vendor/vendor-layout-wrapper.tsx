"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { VendorSidebar } from "@/components/vendor/sidebar";
import { cn } from "@/lib/utils";

interface VendorLayoutWrapperProps {
    children: React.ReactNode;
    vendorName: string;
}

export function VendorLayoutWrapper({
    children,
    vendorName,
}: VendorLayoutWrapperProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    // Don't show sidebar on onboarding page
    const isOnboarding = pathname === "/vendor/onboarding";

    if (isOnboarding) {
        return <div className="min-h-screen bg-slate-50">{children}</div>;
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <VendorSidebar
                vendorName={vendorName}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />
            <main
                className={cn(
                    "flex-1 transition-all duration-300 ease-in-out w-full",
                    isCollapsed ? "lg:pl-20" : "lg:pl-64"
                )}
            >
                <div className="min-h-screen h-full pt-16 lg:pt-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
