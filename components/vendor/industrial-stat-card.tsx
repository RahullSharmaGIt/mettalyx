import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: LucideIcon;
    borderColor: string;
    textColor: string;
    trend?: string;
    statusIcon?: LucideIcon;
}

export const IndustrialStatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    borderColor,
    textColor,
    trend,
    statusIcon: StatusIcon
}: StatCardProps) => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between h-[200px] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Icon className="h-5 w-5 text-slate-700" />
                </div>
            </div>

            <div className="mt-2">
                <div className="text-4xl font-bold text-slate-900 tracking-tight mb-1.5">{value}</div>
                <div className="flex items-center gap-1.5">
                    {StatusIcon && <StatusIcon className="h-3.5 w-3.5 text-slate-500" />}
                    <span className="text-xs text-slate-500 font-medium">
                        {subtitle}
                    </span>
                </div>
            </div>

            {trend && (
                <div className="mt-3 flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                    <span>↗</span>
                    <span>{trend}</span>
                </div>
            )}
        </div>
    );
};
