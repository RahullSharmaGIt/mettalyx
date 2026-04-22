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
        <div className={cn(
            "bg-white border-4 p-8 relative flex flex-col justify-between h-[240px] shadow-[8px_8px_0px_#0F172A]",
            borderColor
        )}>
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{title}</span>
                <div className="h-10 w-10 bg-slate-50 border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#0F172A]">
                    <Icon className="h-5 w-5 text-slate-900" />
                </div>
            </div>

            <div className="mt-4">
                <div className={cn("text-5xl font-black mb-2 tracking-tighter", textColor)}>{value}</div>
                <div className="flex items-center gap-2">
                    {StatusIcon && <StatusIcon className={cn("h-3.5 w-3.5", textColor)} />}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        {subtitle}
                    </span>
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-2 text-emerald-500 font-black uppercase text-[10px] tracking-widest">
                    <span>↗</span>
                    <span>{trend}</span>
                </div>
            )}
        </div>
    );
};
