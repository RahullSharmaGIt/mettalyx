"use client";

import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSidebar } from "./SidebarContext";

export const OEMNavbarTrigger = () => {
    const pathname = usePathname();
    const { openSidebar } = useSidebar();

    const getTitle = (path: string) => {
        if (path.includes("/dashboard")) return "OEM Dashboard";
        if (path.includes("/jobs")) return "Job Management";
        if (path.includes("/post-job")) return "Post Requirement";
        if (path.includes("/inventory")) return "Inventory Portal";
        if (path.includes("/settings")) return "OEM Settings";
        return "OEM Portal";
    };

    return (
        <header className="flex items-center justify-between p-4 border-b-4 border-slate-900 bg-white sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={openSidebar}
                    className="border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                    <Menu className="h-6 w-6" />
                </Button>
                <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 truncate max-w-[150px] md:max-w-none">
                    {getTitle(pathname)}
                </h1>
            </div>

            <Link href="/oem/post-job">
                <Button className="font-black uppercase border-2 border-slate-900 shadow-[4px_4px_0px_#0F172A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] bg-[#f97316] text-slate-900">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Post Job</span>
                </Button>
            </Link>
        </header>
    );
};
