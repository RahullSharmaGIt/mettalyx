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
            "flex flex-col items-center justify-center p-2 rounded-lg transition-all",
            active ? "bg-slate-900 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
        )}>
            <Icon className={cn("h-5 w-5", active ? "text-white" : "text-slate-500")} />
            <span className={cn("text-[10px] font-medium mt-0.5", active ? "text-white" : "text-slate-500")}>
                {label}
            </span>
        </div>
    );
};

export const BottomNav = () => {
    return (
        <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-white border border-slate-200 shadow-lg rounded-2xl flex items-center justify-around z-50 px-2">
            <NavItem icon={LayoutDashboard} label="Dashboard" active />
            <NavItem icon={Briefcase} label="Jobs" />
            <NavItem icon={Box} label="Inventory" />
            <NavItem icon={Settings} label="Settings" />
        </nav>
    );
};
