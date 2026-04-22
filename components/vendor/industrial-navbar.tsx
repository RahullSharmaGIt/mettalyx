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
        <header className="h-20 bg-white border-b-4 border-slate-900 flex items-center justify-between px-8 sticky top-0 z-[40]">
            <div className="flex items-center gap-6 flex-1 max-w-2xl">
                {/* Mobile Menu Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuClick}
                    className="lg:hidden border-4 border-slate-900 bg-white shadow-[4px_4px_0px_#0F172A] rounded-none hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all h-12 w-12"
                >
                    <Menu className="h-6 w-6 text-slate-900" />
                </Button>

                {/* Search Bar */}
                <div className="relative flex-1 hidden md:block group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <Input
                        placeholder="Search orders, bids, RFQs..."
                        className="pl-12 h-12 border-4 border-slate-900 rounded-none bg-slate-50 focus-visible:ring-0 focus-visible:bg-white shadow-[0px_0px_0px_#0F172A] focus-visible:shadow-[4px_4px_0px_#0F172A] transition-all font-bold placeholder:text-slate-400 placeholder:font-normal"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-900 hover:bg-slate-100 rounded-none relative">
                        <Bell className="h-6 w-6" />
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-[#f97316] border-2 border-white rounded-full" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-900 hover:bg-slate-100 rounded-none">
                        <HelpCircle className="h-6 w-6" />
                    </Button>
                </div>

                <div className="h-10 w-px bg-slate-200 hidden sm:block" />

                <div className="flex items-center gap-4 group cursor-pointer pl-4">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-black uppercase text-slate-900 leading-tight">{vendorName}</span>
                        <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-wider">Premium Vendor</span>
                    </div>
                    <div className="h-12 w-12 border-4 border-slate-900 bg-slate-100 overflow-hidden shadow-[4px_4px_0px_#0F172A] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
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
