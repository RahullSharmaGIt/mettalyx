"use client";
// its main view for mobile and desktop
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/app/dashboard/actions";

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

import { OEMUserData } from "./OEMLayoutWrapper";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/oem/dashboard" },
    { icon: User, label: "My Profile", href: "/oem/profile" },
    { icon: Briefcase, label: "My Jobs", href: "/oem/jobs" },
    { icon: Box, label: "Inventory", href: "/oem/inventory" },
    { icon: Plus, label: "Post New Job", href: "/oem/post-job" },
    { icon: Settings, label: "Settings", href: "/oem/settings" },
];

export const OEMSidebarDrawer = ({ oemUser }: { oemUser?: OEMUserData }) => {
    const pathname = usePathname();
    const { isOpen, closeSidebar } = useSidebar();

    const displayName = oemUser?.companyName || oemUser?.name || oemUser?.email || "OEM Partner";
    const subText = oemUser?.email || "OEM Account";

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
                        className="fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-slate-200 z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                    METALLYX
                                </h2>
                                <p className="text-xs text-slate-500 font-medium">
                                    OEM Partner Portal
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={closeSidebar}
                                className="border border-slate-200 bg-white rounded-lg hover:bg-slate-100 transition-all h-9 w-9"
                            >
                                <X className="h-5 w-5 text-slate-700" />
                            </Button>
                        </div>

                        {/* Profile Info */}
                        <Link href="/oem/profile" onClick={closeSidebar}>
                            <div className="p-4 border-b border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 transition-all cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                                        <User className="h-5 w-5 text-slate-700" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Logged in as</span>
                                        <span className="font-semibold text-slate-900 text-sm truncate">
                                            {displayName}
                                        </span>
                                        <span className="text-xs text-slate-400 truncate">
                                            {subText}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto bg-white">
                            {navItems.map((item) => {
                                const active = pathname === item.href;
                                return (
                                    <Link key={item.href} href={item.href} onClick={closeSidebar}>
                                        <div className={cn(
                                            "flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-sm font-medium mb-1",
                                            active
                                                ? "bg-slate-900 text-white shadow-sm"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        )}>
                                            <item.icon className={cn("h-4 w-4", active ? "text-white" : "text-slate-400 group-hover:text-slate-700")} />
                                            <span>
                                                {item.label}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                            <Button
                                onClick={() => logout()}
                                variant="ghost"
                                className="w-full flex items-center justify-start gap-3 px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-700 font-medium transition-all text-sm"
                            >
                                <LogOut className="h-4 w-4 text-slate-400 group-hover:text-rose-600" />
                                <span>Sign Out</span>
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
