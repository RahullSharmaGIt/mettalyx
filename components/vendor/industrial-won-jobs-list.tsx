import { Trophy, Cog, Zap, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface WonJobProps {
    id: string;
    title: string;
    wonTime: string;
    value: number;
    status: "LOGISTICS PENDING" | "IN PRODUCTION" | "COMPLETED";
    isLocked?: boolean;
    updateCount?: number;
}

export const IndustrialWonJobsList = ({ jobs }: { jobs: WonJobProps[] }) => {
    return (
        <div className="bg-[#4ade80]/10 border-4 border-emerald-500 shadow-[8px_8px_0px_#10B981] flex flex-col overflow-hidden">
            <div className="p-4 border-b-4 border-emerald-500 flex justify-between items-center bg-[#4ade80]">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 leading-none">Recent Won Jobs</h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-white/20 px-1.5 py-0.5 rounded leading-none">{jobs.length}</span>
                    <Trophy className="h-4 w-4 text-slate-900" />
                </div>
            </div>

            <div className="divide-y-2 divide-emerald-200">
                {jobs.map((job) => (
                    <div key={job.id} className="p-5 hover:bg-emerald-50 transition-colors group relative">
                        <div className="flex gap-4">
                            <div className="h-10 w-10 border-2 border-slate-900 flex items-center justify-center bg-white shrink-0 shadow-[2px_2px_0px_#0F172A]">
                                {job.status === "IN PRODUCTION" ? <Cog className="h-5 w-5 text-slate-900" /> : <Zap className="h-5 w-5 text-slate-900" />}
                            </div>
                            <div className="flex flex-col gap-1 w-full relative">
                                <Link href={`/vendor/jobs/${job.id}`}>
                                    <h4 className="font-black uppercase text-[11px] text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors cursor-pointer pr-6">
                                        {job.title}
                                    </h4>
                                </Link>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        {job.wonTime} • ₹{job.value.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <Badge className="w-fit rounded-none border-2 border-slate-900 bg-white text-slate-900 font-black text-[8px] px-1.5 py-0">
                                        {job.status}
                                    </Badge>

                                    {job.isLocked ? (
                                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-900 rounded-none font-bold text-[8px] px-1.5 py-0">
                                            <Lock className="h-2.5 w-2.5 mr-1 inline" /> LOCKED
                                        </Badge>
                                    ) : (job.updateCount ?? 0) < 1 ? (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-500 rounded-none font-bold text-[8px] px-1.5 py-0">
                                            1 FREE REVISION
                                        </Badge>
                                    ) : null}

                                    <Link href={`/vendor/jobs/${job.id}/edit`}>
                                        <span className="text-[9px] font-black uppercase text-[#f97316] underline cursor-pointer hover:text-[#ea580c] ml-1">
                                            Edit Quotation
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
