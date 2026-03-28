"use strict";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User,
    Settings,
    Link as LinkIcon,
    Palette,
    Box,
    Cpu,
    Zap,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { title: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
    { title: "Process Management", href: "/vendor/processes", icon: Settings },
    { title: "Platform Integration", href: "/vendor/integrations", icon: LinkIcon },
    { title: "Finishes", href: "/vendor/finishes", icon: Palette },
    { title: "Materials", href: "/vendor/materials", icon: Box },
    { title: "Machines", href: "/vendor/machines", icon: Cpu },
    { title: "Capabilities", href: "/vendor/capabilities", icon: Zap },
    { title: "Settings", href: "/vendor/dashboard/profile-settings", icon: Settings },
];

interface VendorSidebarProps {
    vendorName: string;
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (value: boolean) => void;
}

export const VendorSidebar = ({
    vendorName,
    isCollapsed,
    setIsCollapsed,
    isMobileOpen,
    setIsMobileOpen
}: VendorSidebarProps) => {
    const pathname = usePathname();

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname, setIsMobileOpen]);

    return (
        <>
            {/* Mobile Hamburger Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="bg-white border-slate-200 shadow-sm"
                >
                    {isMobileOpen ? <X className="h-4 w-4 text-slate-600" /> : <Menu className="h-4 w-4 text-slate-600" />}
                </Button>
            </div>

            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-white border-r border-slate-200 flex flex-col",
                    isCollapsed ? "w-20" : "w-64",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Vendor Profile Section */}
                <div className={cn(
                    "p-6 flex flex-col items-center border-b border-slate-100 bg-slate-50/50",
                    isCollapsed && "px-2"
                )}>
                    <div className={cn(
                        "h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 transition-transform duration-300 shadow-sm",
                        isCollapsed && "scale-75 mb-0"
                    )}>
                        <User className="h-6 w-6 text-slate-400" />
                    </div>
                    {!isCollapsed && (
                        <div className="text-center overflow-hidden w-full">
                            <h2 className="text-sm font-bold text-slate-900 truncate px-2">{vendorName}</h2>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Vendor Profile</span>
                        </div>
                    )}
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                    isActive
                                        ? "bg-slate-900 text-white shadow-md active:scale-95"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                                    isCollapsed && "justify-center px-2"
                                )}
                                title={isCollapsed ? item.title : undefined}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 shrink-0 transition-colors",
                                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                                )} />
                                {!isCollapsed && (
                                    <span className="text-sm font-semibold tracking-tight">{item.title}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse Toggle Footer (Desktop) */}
                <div className="p-4 border-t border-slate-100 hidden lg:block">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 group"
                    >
                        {isCollapsed ? <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" /> : (
                            <div className="flex items-center gap-2">
                                <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Collapse</span>
                            </div>
                        )}
                    </Button>
                </div>
            </aside>
        </>
    );
};
