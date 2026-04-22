"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Briefcase,
    Box,
    Settings,
    X,
    LogOut,
    Plus,
    User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./SidebarContext";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/oem/dashboard" },
    { icon: Briefcase, label: "My Jobs", href: "/oem/jobs" },
    { icon: Box, label: "Inventory", href: "/oem/inventory" },
    { icon: Plus, label: "Post New Job", href: "/oem/post-job" },
    { icon: Settings, label: "Settings", href: "/oem/settings" },
];

export const OEMSidebarDrawer = () => {
    const pathname = usePathname();
    const { isOpen, closeSidebar } = useSidebar();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSidebar}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 bottom-0 w-80 bg-white border-r-4 border-slate-900 z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b-4 border-slate-900 flex justify-between items-center bg-[#f97316]">
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                                METALLYX OEM
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={closeSidebar}
                                className="border-2 border-slate-900 bg-white shadow-[2px_2px_0px_#0F172A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Profile Info */}
                        <div className="p-6 border-b-4 border-slate-900 bg-slate-50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full border-4 border-slate-900 bg-white flex items-center justify-center overflow-hidden">
                                    <User className="h-7 w-7 text-slate-900" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Logged in as</span>
                                    <span className="font-black text-slate-900 uppercase">OEM Partner</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 space-y-3 overflow-y-auto bg-white">
                            {navItems.map((item) => {
                                const active = pathname === item.href;
                                return (
                                    <Link key={item.href} href={item.href} onClick={closeSidebar}>
                                        <div className={cn(
                                            "flex items-center gap-4 p-4 border-2 transition-all group",
                                            active
                                                ? "bg-[#4ade80] border-slate-900 shadow-[4px_4px_0px_#0F172A]"
                                                : "border-transparent hover:border-slate-900 hover:bg-slate-50 hover:shadow-[4px_4px_0px_#0F172A]"
                                        )}>
                                            <item.icon className={cn("h-6 w-6", active ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900")} />
                                            <span className={cn(
                                                "font-black uppercase tracking-tight text-lg",
                                                active ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"
                                            )}>
                                                {item.label}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer */}
                        <div className="p-4 border-t-4 border-slate-900 bg-slate-100">
                            <Button
                                variant="ghost"
                                className="w-full flex items-center justify-start gap-4 p-6 border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0F172A] hover:bg-red-50 hover:border-red-600 hover:text-red-600 group"
                            >
                                <LogOut className="h-6 w-6 text-slate-500 group-hover:text-red-600" />
                                <span className="font-black uppercase text-lg">Sign Out</span>
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
