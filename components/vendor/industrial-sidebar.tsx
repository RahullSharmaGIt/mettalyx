"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Zap,
    FileText,
    Trophy,
    Settings,
    LogOut,
    Menu,
    X,
    Search,
    Bell,
    HelpCircle
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/logout";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/vendor/dashboard" },
    { icon: Zap, label: "New RFQs", href: "/vendor/jobs" },
    { icon: FileText, label: "Active Bids", href: "/vendor/my-jobs" },
    { icon: Trophy, label: "Jobs Won", href: "/vendor/won-jobs" },
    { icon: Settings, label: "Settings", href: "/vendor/dashboard/profile-settings" },
];

export const IndustrialSidebar = ({
    isOpen,
    onClose,
    isMobile = false
}: {
    isOpen: boolean;
    onClose: () => void;
    isMobile?: boolean;
}) => {
    const pathname = usePathname();

    const SidebarContent = (
        <div className="h-full flex flex-col bg-white border-r border-slate-200">
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-200 bg-white">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    METALLYX
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Vendor Portal
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} onClick={isMobile ? onClose : undefined}>
                            <div className={cn(
                                "flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-sm font-medium mb-1",
                                isActive
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}>
                                <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700")} />
                                <span>
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                <Button
                    variant="ghost"
                    onClick={() => logout()}
                    className="w-full flex items-center justify-start gap-3 px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-700 font-medium transition-all text-sm"
                >
                    <LogOut className="h-4 w-4 text-slate-400 group-hover:text-rose-600" />
                    <span>Logout</span>
                </Button>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[100] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-72 z-[110] lg:hidden"
                        >
                            {SidebarContent}
                            <Button
                                onClick={onClose}
                                className="absolute top-4 -right-11 h-9 w-9 bg-white border border-slate-200 rounded-lg p-0 flex items-center justify-center shadow-sm"
                            >
                                <X className="h-5 w-5 text-slate-700" />
                            </Button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    }

    return (
        <aside className="hidden lg:flex flex-col w-72 fixed left-0 top-0 bottom-0 z-50">
            {SidebarContent}
        </aside>
    );
};
