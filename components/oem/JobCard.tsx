import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Box, CheckCircle2, Clock } from "lucide-react";

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
    title,
    description,
    material,
    deadline,
    tolerance,
    status,
}: JobCardProps) => {
    const isAssigned = ["ASSIGNED", "IN_PROGRESS", "QC", "COMPLETED", "PAID"].includes(status);
    const isPending = status === "PENDING_REVIEW" || status === "OPEN";

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "ASSIGNED":
            case "IN_PROGRESS":
            case "QC":
                return { label: "ASSIGNED", color: "bg-[#4ade80] text-slate-900 border-slate-900", icon: CheckCircle2 };
            case "COMPLETED":
            case "PAID":
                return { label: "COMPLETED", color: "bg-green-500 text-white border-slate-900", icon: CheckCircle2 };
            case "PAST":
                return { label: "DONE", color: "bg-slate-200 text-slate-800 border-slate-900", icon: CheckCircle2 };
            default:
                return { label: "PENDING", color: "bg-[#fb923c] text-slate-900 border-slate-900", icon: Clock };
        }
    };

    const statusConfig = getStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    // Determine top border color based on status
    const topBorderColor = isAssigned ? "bg-[#f97316]" : isPending ? "bg-slate-600" : "bg-green-700";

    return (
        <div className="border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0F172A] flex flex-col overflow-hidden">
            <div className={cn("h-2 w-full border-b-2 border-slate-900", topBorderColor)} />

            <div className="p-4 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                        <div className="h-12 w-12 border-2 border-slate-900 flex items-center justify-center bg-slate-50">
                            <Box className="h-6 w-6 text-slate-600" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-xl font-black text-slate-900 leading-tight uppercase">
                                {title}
                            </h3>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                {description}
                            </span>
                        </div>
                    </div>

                    <Badge className={cn("flex gap-1 items-center font-black text-[10px] py-1 px-2 border-2 rounded-md uppercase", statusConfig.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                    </Badge>
                </div>

                <div className="grid grid-cols-3 border-2 border-slate-900 bg-slate-50 divide-x-2 divide-slate-900">
                    <div className="p-2 flex flex-col">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Material</span>
                        <span className="text-[13px] font-bold text-slate-800 truncate leading-tight uppercase font-mono">{material}</span>
                    </div>
                    <div className="p-2 flex flex-col">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Deadline</span>
                        <span className={cn("text-[13px] font-black leading-tight uppercase font-mono", status === 'OPEN' ? 'text-red-600' : 'text-slate-800')}>
                            {deadline}
                        </span>
                    </div>
                    <div className="p-2 flex flex-col">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Tolerance</span>
                        <span className="text-[13px] font-black text-slate-800 leading-tight font-mono">{tolerance}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
