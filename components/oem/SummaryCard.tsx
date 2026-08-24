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
    iconColor = "text-slate-700",
}: SummaryCardProps) => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between h-[180px] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {title}
                </span>
                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Icon className={cn("h-5 w-5", iconColor)} />
                </div>
            </div>

            <div className="flex flex-col gap-1 mt-3">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">
                    {value}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                    {subtitle}
                </span>
            </div>
        </div>
    );
};
