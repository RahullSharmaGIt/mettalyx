"use client";

import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSidebar } from "./SidebarContext";



import { OEMUserData } from "./OEMLayoutWrapper";

export const OEMNavbarTrigger = ({ oemUser }: { oemUser?: OEMUserData }) => {
    const pathname = usePathname();
    const { openSidebar } = useSidebar();

    const getTitle = (path: string) => {
        if (path.includes("/dashboard")) return "OEM Dashboard";
        if (path.includes("/profile")) return "My OEM Profile";
        if (path.includes("/jobs")) return "Job Management";
        if (path.includes("/post-job")) return "Post Requirement";
        if (path.includes("/inventory")) return "Inventory Portal";
        if (path.includes("/settings")) return "OEM Settings";
        return "OEM Portal";
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={openSidebar}
                    className="border border-slate-200 rounded-lg hover:bg-slate-100 transition-all h-10 w-10"
                >
                    <Menu className="h-5 w-5 text-slate-700" />
                </Button>
                {/* top heading shows which page we are currently at */}
                <h1 className="text-lg font-bold text-slate-900 truncate max-w-[150px] md:max-w-none">
                    {getTitle(pathname)}
                </h1>
            </div>

            <Link href="/oem/post-job">
                <Button className="font-medium border border-slate-900 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition-all px-3 sm:px-4 py-2">
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Post Job</span>
                </Button>
            </Link>
        </header>   
    );
};
