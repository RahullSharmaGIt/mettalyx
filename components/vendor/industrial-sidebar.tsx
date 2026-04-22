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
        <div className="h-full flex flex-col bg-white border-r-4 border-slate-900">
            {/* Logo Section */}
            <div className="p-8 border-b-4 border-slate-900 bg-white">
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                    METALLYX
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                    Industrial Vendor
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} onClick={isMobile ? onClose : undefined}>
                            <div className={cn(
                                "flex items-center gap-3 p-4 border-2 transition-all group mb-4",
                                isActive
                                    ? "bg-[#f97316] border-slate-900 shadow-[4px_4px_0px_#0F172A] text-white"
                                    : "bg-white border-transparent text-slate-500 hover:border-slate-900 hover:shadow-[4px_4px_0px_#0F172A] hover:text-slate-900"
                            )}>
                                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                                <span className="font-black uppercase tracking-tight text-sm">
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-6 border-t-4 border-slate-900 bg-slate-50">
                <Button
                    variant="ghost"
                    onClick={() => logout()}
                    className="w-full flex items-center justify-start gap-3 p-4 border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0F172A] hover:bg-red-50 hover:border-red-600 hover:text-red-600 group transition-all"
                >
                    <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-600" />
                    <span className="font-black uppercase tracking-tight text-sm">Logout</span>
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
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
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
                                className="absolute top-4 -right-12 h-10 w-10 bg-white border-4 border-slate-900 rounded-none p-0 flex items-center justify-center shadow-[4px_4px_0px_#0F172A]"
                            >
                                <X className="h-6 w-6 text-slate-900" />
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
