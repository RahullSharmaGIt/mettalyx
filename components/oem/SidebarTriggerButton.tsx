"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./SidebarContext";

export const SidebarTriggerButton = () => {
    const { openSidebar } = useSidebar();

    return (
        <Button
            onClick={openSidebar}
            className="md:hidden flex items-center gap-2 font-black uppercase border-2 border-slate-900 shadow-[4px_4px_0px_#0F172A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] bg-white text-slate-900 mb-6 w-full py-6"
        >
            <Menu className="h-5 w-5" />
            Open Menu
        </Button>
    );
};
