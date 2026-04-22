import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Trophy, ChevronRight, Calculator, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function WonJobsPage() {
    const session = await auth();

    if (!session || session.user.role !== UserRole.VENDOR) {
        redirect("/auth/login");
    }

    const wonBids = await prisma.bid.findMany({
        where: {
            vendorId: session.user.id,
            status: "WON"
        },
        include: {
            job: {
                select: {
                    title: true,
                    quantity: true,
                    deadline: true,
                    status: true
                }
            }
        },
        orderBy: { updatedAt: "desc" }
    });

    return (
        <div className="p-8 space-y-8 bg-[#F8F8F8] min-h-screen">
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-[#4ade80] border-4 border-slate-900 shadow-[4px_4px_0px_#0F172A] flex items-center justify-center">
                    <Trophy className="h-10 w-10 text-slate-900" />
                </div>
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Jobs Won</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">All successfully awarded contracts</p>
                </div>
            </div>

            <div className="grid gap-6">
                {wonBids.length === 0 ? (
                    <div className="bg-white border-4 border-slate-900 p-12 text-center shadow-[8px_8px_0px_#0F172A]">
                        <p className="font-black uppercase text-slate-400">No won jobs found in your history.</p>
                    </div>
                ) : (
                    wonBids.map((bid) => (
                        <Link key={bid.id} href={`/vendor/jobs/${bid.jobId}`}>
                            <div className="bg-white border-4 border-slate-900 p-6 shadow-[8px_8px_0px_#0F172A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex-1 space-y-1">
                                        <Badge className="bg-[#4ade80] text-slate-900 border-2 border-slate-900 rounded-none font-black text-[9px] px-2 mb-2">
                                            AWARDED #{bid.jobId.slice(-6).toUpperCase()}
                                        </Badge>
                                        <h2 className="text-2xl font-black uppercase text-slate-900 group-hover:text-emerald-600 transition-colors">{bid.job.title}</h2>
                                        <div className="flex gap-6 mt-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calculator className="h-4 w-4" />
                                                <span className="text-[11px] font-bold uppercase tracking-widest">{bid.job.quantity} Units</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar className="h-4 w-4" />
                                                <span className="text-[11px] font-bold uppercase tracking-widest">Deadline: {new Date(bid.job.deadline).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-slate-900 tracking-tighter">₹{bid.proposedPrice.toLocaleString()}</div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contract Value</div>
                                        </div>
                                        <div className="h-12 w-12 bg-slate-50 border-4 border-slate-900 flex items-center justify-center group-hover:bg-emerald-50 transition-colors shadow-[4px_4px_0px_#0F172A]">
                                            <ChevronRight className="h-6 w-6 text-slate-900" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
