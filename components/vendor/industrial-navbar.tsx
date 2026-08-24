"use client";

import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const IndustrialNavbar = ({
    onMenuClick,
    vendorName
}: {
    onMenuClick: () => void;
    vendorName: string;
}) => {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-[40]">
            <div className="flex items-center gap-6 flex-1 max-w-2xl">
                {/* Mobile Menu Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuClick}
                    className="lg:hidden border border-slate-200 bg-white rounded-lg hover:bg-slate-100 transition-all h-10 w-10"
                >
                    <Menu className="h-5 w-5 text-slate-700" />
                </Button>

                {/* Search Bar */}
                <div className="relative flex-1 hidden md:block group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <Input
                        placeholder="Search orders, bids, RFQs..."
                        className="pl-10 h-10 border border-slate-200 rounded-lg bg-slate-50 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:bg-white transition-all text-sm placeholder:text-slate-400 font-normal"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600 hover:bg-slate-100 rounded-lg relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-slate-900 rounded-full" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600 hover:bg-slate-100 rounded-lg">
                        <HelpCircle className="h-5 w-5" />
                    </Button>
                </div>

                <div className="h-8 w-px bg-slate-200 hidden sm:block" />

                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-semibold text-slate-900 leading-tight">{vendorName}</span>
                        <span className="text-xs font-medium text-slate-500">Verified Vendor</span>
                    </div>
                    <div className="h-10 w-10 border border-slate-200 bg-slate-100 rounded-full overflow-hidden transition-all">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=SteelForge"
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};
