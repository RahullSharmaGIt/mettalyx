import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
    title: string;
    value: number | string;
    subtitle: string;
    icon: LucideIcon;
    bgColor?: string;
    iconColor?: string;
}

export const SummaryCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    bgColor = "bg-white",
    iconColor = "text-slate-900",
}: SummaryCardProps) => {
    return (
        <div className={cn(
            "border-2 border-slate-900 p-6 flex flex-col gap-4 shadow-[#0F172A] shadow-[4px_4px_0px_0px] transition-all",
            bgColor
        )}>
            <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-wider text-slate-900">
                    {title}
                </span>
                <Icon className={cn("h-6 w-6", iconColor)} />
            </div>

            <div className="flex flex-col gap-1 mt-8">
                <span className="text-5xl font-black text-slate-900">
                    {value}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600">
                    {subtitle}
                </span>
            </div>
        </div>
    );
};
