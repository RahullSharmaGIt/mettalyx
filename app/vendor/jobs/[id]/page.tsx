import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft,
    Clock,
    Package,
    ShieldCheck,
    FileText,
    Download,
    AlertTriangle,
    IndianRupee,
    Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SecureFileLink } from "@/components/shared/secure-file-link";

export default async function WonJobDetailPage({ params }: any) {
    const session = await auth();

    if (!session || session.user.role !== UserRole.VENDOR) {
        redirect("/auth/login");
    }

    const bidData = await prisma.bid.findUnique({
        where: {
            vendorId_jobId: {
                vendorId: session.user.id!,
                jobId: params?.id || ""
            }
        },
        include: {
            job: {
                include: {
                    files: true,
                    oem: { select: { companyName: true, name: true } }
                }
            }
        }
    });

    if (!bidData) notFound();
    const bid = bidData as any;

    if (bid.status !== "WON") {
        redirect("/vendor/dashboard");
    }

    const clientName = bid.job.oem.companyName || bid.job.oem.name || "TATA Advanced Systems";

    return (
        <div className="bg-[#F8F8F8] min-h-screen">
            {/* Sub-header */}
            <div className="bg-white border-b-4 border-slate-900 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/vendor/dashboard">
                        <Button variant="ghost" size="icon" className="border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A] rounded-none">
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <div>
                        <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-[0.2em]">Bid Modification Terminal</span>
                        <h1 className="text-4xl font-black uppercase text-slate-900 tracking-tighter flex items-center gap-3">
                            Edit Quotation <span className="text-[#f97316]">#QT-{bid.id.slice(-4).toUpperCase()}</span>
                        </h1>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="border-4 border-slate-900 rounded-none font-black uppercase shadow-[4px_4px_0px_#0F172A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                        Discard Changes
                    </Button>
                    <Button className="bg-[#f97316] hover:bg-[#ea580c] text-white border-4 border-slate-900 rounded-none font-black uppercase px-8 shadow-[4px_4px_0px_#0F172A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Submit Revision
                    </Button>
                </div>
            </div>

            <div className="p-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Financial Adjustment Card */}
                    <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_#0F172A] p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 bg-[#f97316] border-2 border-slate-900 flex items-center justify-center">
                                <IndianRupee className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-black uppercase text-slate-900">Financial Adjustment</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Revised Quotation Value (INR)</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-300">₹</div>
                                    <Input
                                        defaultValue={bid.proposedPrice}
                                        className="h-24 pl-16 text-5xl font-black border-4 border-slate-900 rounded-none bg-slate-50 focus-visible:ring-0 focus-visible:bg-white transition-all shadow-[inset_4px_4px_0px_rgba(0,0,0,0.05)]"
                                    />
                                    <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Current Value: ₹{bid.proposedPrice.toLocaleString()} (+8.26%)
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Reason for Adjustment</label>
                                <Textarea
                                    placeholder="Explain the rationale for this quote revision..."
                                    className="min-h-[200px] border-4 border-slate-900 rounded-none bg-slate-50 focus-visible:ring-0 focus-visible:bg-white text-lg font-medium p-6"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] font-black text-[#f97316] uppercase tracking-widest">Required for approval audit</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">0 / 500 Characters</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Warning Box */}
                    <div className="bg-[#FEF9C3] border-4 border-slate-900 p-6 flex items-start gap-4 shadow-[8px_8px_0px_#A16207]">
                        <AlertTriangle className="h-8 w-8 text-[#A16207] shrink-0" />
                        <div>
                            <h3 className="text-lg font-black uppercase text-slate-900 leading-tight">
                                Warning: You can only edit the quotation value {bid.updateCount + 2} times before the final bid is placed.
                            </h3>
                            <p className="text-xs font-black uppercase text-[#A16207] mt-1">Remaining Edits: {1 - bid.updateCount}</p>
                        </div>
                    </div>

                    {/* Files Section (Download File Option) */}
                    <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_#0F172A] p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 bg-slate-900 flex items-center justify-center">
                                <Download className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-black uppercase text-slate-900">Project Files & Drawings</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {bid.job.files.map((file: any) => (
                                <div key={file.id}>
                                    <SecureFileLink
                                        fileId={file.id}
                                        originalName={file.originalName}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Area */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Job Specs */}
                    <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_#0F172A]">
                        <div className="p-4 border-b-4 border-slate-900 bg-slate-50 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-slate-900" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Job Specifications</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Material</span>
                                <p className="font-black uppercase text-lg text-slate-900">{bid.job.material} {bid.job.materialGrade}</p>
                            </div>
                            <div className="h-0.5 bg-slate-100 w-full" />
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Quantity</span>
                                <p className="font-black uppercase text-lg text-slate-900">{bid.job.quantity.toLocaleString()} Units <span className="text-xs text-slate-400 font-bold">(Standard Batch)</span></p>
                            </div>
                            <div className="h-0.5 bg-slate-100 w-full" />
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Delivery Deadline</span>
                                <p className="font-black uppercase text-lg text-slate-900">{new Date(bid.job.deadline).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}</p>
                            </div>
                            <div className="h-0.5 bg-slate-100 w-full" />
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Client</span>
                                <p className="font-black uppercase text-lg text-slate-900">{clientName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Industrial Component Image */}
                    <div className="border-4 border-slate-900 shadow-[8px_8px_0px_#0F172A] overflow-hidden group">
                        <div className="relative h-64 bg-slate-200">
                            <img
                                src="https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=800&auto=format&fit=crop"
                                alt="Part"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute bottom-4 left-4 bg-white border-2 border-slate-900 px-3 py-1 text-[10px] font-black uppercase">
                                REF: V-902 PRECISION MACHINE
                            </div>
                        </div>
                    </div>

                    {/* Technical Note */}
                    <div className="bg-[#4ade80] border-4 border-slate-900 p-6 shadow-[8px_8px_0px_#10B981]">
                        <h3 className="text-sm font-black uppercase text-slate-900 tracking-widest mb-3">Technical Note</h3>
                        <p className="text-[11px] font-bold text-emerald-900 leading-relaxed uppercase tracking-tight">
                            Revisions exceeding 10% of the original bid value require secondary verification from the regional manufacturing lead.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Insight Row */}
            <div className="p-8 border-t-4 border-slate-900 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 bg-white">
                {['SHOP FLOOR A-9', 'MATERIAL YARD', 'ASSEMBLY LAB'].map((label) => (
                    <div key={label} className="relative h-48 border-4 border-slate-900 overflow-hidden group shadow-[4px_4px_0px_#0F172A]">
                        <img
                            src={`https://images.unsplash.com/photo-1541888941255-250281b3952f?q=80&w=800&auto=format&fit=crop&sig=${label}`}
                            alt={label}
                            className="w-full h-full object-cover opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 flex items-end p-6">
                            <h3 className="text-xl font-black text-slate-900 uppercase">{label}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
