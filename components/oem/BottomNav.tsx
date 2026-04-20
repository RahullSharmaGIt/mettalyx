import { LayoutDashboard, Briefcase, Box, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
    icon: typeof LayoutDashboard;
    label: string;
    active?: boolean;
}

const NavItem = ({ icon: Icon, label, active }: NavItemProps) => {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-2 rounded-lg transition-all border-2",
            active ? "bg-[#f97316] border-slate-900 shadow-[2px_2px_0px_#0F172A]" : "border-transparent text-slate-500"
        )}>
            <Icon className={cn("h-6 w-6", active ? "text-slate-900" : "text-slate-500")} />
            <span className={cn("text-[9px] font-black uppercase mt-1", active ? "text-slate-900" : "text-slate-500")}>
                {label}
            </span>
        </div>
    );
};

export const BottomNav = () => {
    return (
        <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_#0F172A] flex items-center justify-around z-50">
            <NavItem icon={LayoutDashboard} label="Dashboard" active />
            <NavItem icon={Briefcase} label="Jobs" />
            <NavItem icon={Box} label="Inventory" />
            <NavItem icon={Settings} label="Settings" />
        </nav>
    );
};
