"use client";

import { SidebarProvider } from "./SidebarContext";
import { OEMNavbarTrigger } from "./OEMNavbarTrigger";
import { OEMSidebarDrawer } from "./OEMSidebarDrawer";
// import { BottomNav } from "./BottomNav";

export interface OEMUserData {
    id: string;
    name: string | null;
    email: string;
    companyName: string | null;
    createdAt: string;
}

export const OEMLayoutWrapper = ({
    children,
    oemUser,
}: {
    children: React.ReactNode;
    oemUser: OEMUserData;
}) => {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-[#f8fafc] flex flex-col">
                <OEMNavbarTrigger oemUser={oemUser} />

                <OEMSidebarDrawer oemUser={oemUser} />

                <main className="flex-1 w-full max-w-7xl mx-auto">
                    {children}
                </main>

                {/* <BottomNav /> */}
            </div>
        </SidebarProvider>
    );
};
