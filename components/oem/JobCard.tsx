import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Box, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

interface JobCardProps {
    id: string;
    title: string;
    description: string;
    material: string;
    deadline: string;
    tolerance: string;
    status: string;
}

export const JobCard = ({
    id,
    title,
    description,
    material,
    deadline,
    tolerance,
    status,
}: JobCardProps) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "ASSIGNED":
            case "IN_PROGRESS":
            case "QC":
                return { label: "ASSIGNED", color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle2 };
            case "COMPLETED":
            case "PAID":
                return { label: "COMPLETED", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 };
            case "PAST":
                return { label: "DONE", color: "bg-slate-100 text-slate-700 border-slate-200", icon: CheckCircle2 };
            default:
                return { label: "PENDING", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock };
        }
    };

    const statusConfig = getStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    return (
        <Link href={`/oem/jobs/${id}`} className="block group">
            <div className="border border-slate-200 bg-white rounded-2xl shadow-sm hover:shadow-md hover:border-slate-400 transition-all cursor-pointer p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="flex gap-3.5">
                        <div className="h-11 w-11 rounded-xl border border-slate-200 bg-slate-50 group-hover:bg-slate-900 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                            <Box className="h-5 w-5 text-slate-700 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                {title}
                                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                            </h3>
                            <span className="text-xs text-slate-500 font-medium mt-0.5">
                                {description}
                            </span>
                        </div>
                    </div>

                    <Badge variant="outline" className={cn("flex gap-1.5 items-center font-medium text-xs py-1 px-2.5 rounded-md shadow-none", statusConfig.color)}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusConfig.label}
                    </Badge>
                </div>

                <div className="grid grid-cols-3 border border-slate-200 bg-slate-50/50 rounded-xl divide-x divide-slate-200 overflow-hidden">
                    <div className="p-3 flex flex-col">
                        <span className="text-xs font-medium text-slate-400 mb-0.5">Material</span>
                        <span className="text-sm font-semibold text-slate-800 truncate font-mono">{material}</span>
                    </div>
                    <div className="p-3 flex flex-col">
                        <span className="text-xs font-medium text-slate-400 mb-0.5">Deadline</span>
                        <span className={cn("text-sm font-semibold font-mono", status === 'OPEN' ? 'text-rose-600' : 'text-slate-800')}>
                            {deadline}
                        </span>
                    </div>
                    <div className="p-3 flex flex-col">
                        <span className="text-xs font-medium text-slate-400 mb-0.5">Tolerance</span>
                        <span className="text-sm font-semibold text-slate-800 font-mono">{tolerance}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
