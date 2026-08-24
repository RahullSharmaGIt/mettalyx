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
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-900">Recent Won Jobs</h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-full">{jobs.length}</span>
                    <Trophy className="h-4 w-4 text-slate-700" />
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {jobs.map((job) => (
                    <div key={job.id} className="p-5 hover:bg-slate-50/60 transition-colors group relative">
                        <div className="flex gap-3.5">
                            <div className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
                                {job.status === "IN PRODUCTION" ? <Cog className="h-4 w-4 text-slate-700" /> : <Zap className="h-4 w-4 text-slate-700" />}
                            </div>
                            <div className="flex flex-col gap-1 w-full relative">
                                <Link href={`/vendor/jobs/${job.id}`}>
                                    <h4 className="font-semibold text-sm text-slate-900 leading-snug group-hover:text-slate-600 transition-colors cursor-pointer pr-4">
                                        {job.title}
                                    </h4>
                                </Link>
                                <div className="flex justify-between items-center mt-0.5">
                                    <span className="text-xs text-slate-500 font-medium">
                                        {job.wonTime} • ₹{job.value.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <Badge className="w-fit rounded-md border border-slate-200 bg-slate-100 text-slate-800 font-medium text-xs px-2 py-0.5 shadow-none hover:bg-slate-100">
                                        {job.status}
                                    </Badge>

                                    {job.isLocked ? (
                                        <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 rounded-md font-medium text-xs px-2 py-0.5">
                                            <Lock className="h-3 w-3 mr-1 inline text-slate-400" /> Locked
                                        </Badge>
                                    ) : (job.updateCount ?? 0) < 1 ? (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-md font-medium text-xs px-2 py-0.5">
                                            1 Free Revision
                                        </Badge>
                                    ) : null}

                                    <Link href={`/vendor/jobs/${job.id}/edit`}>
                                        <span className="text-xs font-semibold text-slate-900 hover:underline cursor-pointer ml-1">
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
