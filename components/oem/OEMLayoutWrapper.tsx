"use client";

import { SidebarProvider } from "./SidebarContext";
import { OEMNavbarTrigger } from "./OEMNavbarTrigger";
import { OEMSidebarDrawer } from "./OEMSidebarDrawer";
import { BottomNav } from "./BottomNav";

export const OEMLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-[#f8fafc] flex flex-col">
                <OEMNavbarTrigger />
                <OEMSidebarDrawer />

                <main className="flex-1 w-full max-w-7xl mx-auto">
                    {children}
                </main>

                <BottomNav />
            </div>
        </SidebarProvider>
    );
};
