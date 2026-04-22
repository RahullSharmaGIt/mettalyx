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
    Send,
    LogOut,
    Percent,
    Timer,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function EditQuotationPage({
    params
}: any) {
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
                    oem: { select: { companyName: true, name: true } }
                }
            }
        }
    });

    if (!bidData) notFound();
    const bid = bidData as any;

    const clientName = bid.job.oem.companyName || bid.job.oem.name || "TATA Advanced Systems";

    return (
        <div className="bg-[#F8F8F8] min-h-screen pb-20 lg:pb-0">
            {/* Page Header - Refined to match image breadcrumb style */}
            <div className="p-6 lg:p-10">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f97316]">Editing Draft</span>
                    <h1 className="text-4xl lg:text-6xl font-[1000] uppercase text-slate-900 tracking-tighter leading-none">
                        Quotation <br className="lg:hidden" />
                        <span className="text-[#f97316]">#{bid.jobId.slice(-8).toUpperCase()}</span>
                    </h1>
                </div>
            </div>

            <div className="px-6 lg:px-10 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Main Edit Section */}
                <div className="lg:col-span-8 space-y-8 lg:space-y-10">

                    {/* Job Summary Card (Mobile visible, Desktop style) */}
                    <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_#0F172A]">
                        <div className="p-4 border-b-4 border-slate-900 bg-[#4ade80] flex justify-between items-center">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Job Summary</h3>
                            <ShieldCheck className="h-4 w-4 text-slate-900" />
                        </div>
                        <div className="p-6 flex flex-col md:flex-row gap-6">
                            <div className="h-24 w-24 border-4 border-slate-900 bg-slate-100 shrink-0 overflow-hidden shadow-[4px_4px_0px_#0F172A]">
                                <img
                                    src="https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=200&auto=format&fit=crop"
                                    alt="Part"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-xl font-black uppercase text-slate-900">{bid.job.title}</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        Batch #{bid.jobId.slice(-4).toUpperCase()} | Qty: {bid.job.quantity} Units
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border-2 border-slate-200">
                                    <div>
                                        <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Client</span>
                                        <p className="text-xs font-black uppercase text-slate-900">{clientName}</p>
                                    </div>
                                    <div>
                                        <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Deadline</span>
                                        <p className="text-xs font-black uppercase text-slate-900">
                                            {new Date(bid.job.deadline).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Warning Box */}
                    <div className="bg-[#FEF9C3] border-4 border-slate-900 p-6 flex items-start gap-4 shadow-[8px_8px_0px_#0F172A]">
                        <AlertTriangle className="h-6 w-6 text-slate-900 shrink-0" />
                        <div>
                            <h3 className="text-sm font-black uppercase text-slate-900 leading-tight">
                                Warning: You can only edit the quotation value {bid.updateCount + 2} times before the final bid is placed.
                            </h3>
                            <p className="text-[10px] font-black uppercase text-slate-900/60 mt-1">Remaining Edits: {1 - bid.updateCount}</p>
                        </div>
                    </div>

                    {/* Quotation Value Input */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Total Quotation Value (USD)</label>
                        <div className="relative">
                            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-5xl font-black text-slate-900">$</div>
                            <Input
                                defaultValue="12450.00"
                                className="h-32 pl-16 text-6xl font-black border-4 border-slate-900 rounded-none bg-white focus-visible:ring-0 shadow-[8px_8px_0px_#0F172A] transition-all"
                            />
                        </div>
                    </div>

                    {/* Revision Reason */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Revision Reason / Scope Details</label>
                        <Textarea
                            placeholder="Reason for the editing quotation value"
                            className="min-h-[250px] border-4 border-slate-900 rounded-none bg-white focus-visible:ring-0 text-xl font-medium p-8 shadow-[8px_8px_0px_#0F172A]"
                        />
                    </div>

                    {/* New Info Row (Lead time & Tax) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                        <div className="bg-white border-4 border-slate-900 p-8 shadow-[8px_8px_0px_#0F172A] space-y-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Lead Time</span>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-[#f97316] border-2 border-slate-900 flex items-center justify-center">
                                    <Timer className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-3xl font-[1000] uppercase text-slate-900">14 Days</span>
                            </div>
                        </div>

                        <div className="bg-white border-4 border-slate-900 p-8 shadow-[8px_8px_0px_#0F172A] space-y-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Tax Rate</span>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-[#f97316]/10 border-2 border-[#f97316] flex items-center justify-center">
                                    <Percent className="h-5 w-5 text-[#f97316]" />
                                </div>
                                <span className="text-3xl font-[1000] uppercase text-slate-900">8.5%</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Action Buttons */}
                    <div className="hidden lg:flex gap-6 pt-10">
                        <Link href="/vendor/dashboard" className="flex-1">
                            <Button variant="outline" className="w-full h-20 border-4 border-slate-900 rounded-none font-black uppercase text-xl shadow-[8px_8px_0px_#0F172A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                                Discard Changes
                            </Button>
                        </Link>
                        <Button className="flex-[1.5] h-20 bg-[#f97316] hover:bg-[#ea580c] text-white border-4 border-slate-900 rounded-none font-black uppercase text-xl shadow-[8px_8px_0px_#0F172A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-4">
                            Submit Revision <Send className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Right Column (Desktop Specifications) */}
                <div className="lg:col-span-4 hidden lg:block space-y-10">
                    <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_#0F172A]">
                        <div className="p-4 border-b-4 border-slate-900 bg-slate-50 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-slate-900" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Job Specifications</h3>
                        </div>
                        <div className="p-8 space-y-8">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Material</span>
                                <p className="font-black uppercase text-2xl text-slate-900">{bid.job.material}</p>
                            </div>
                            <div className="h-1 bg-slate-100 w-full" />
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Quantity</span>
                                <p className="font-black uppercase text-2xl text-slate-900">{bid.job.quantity.toLocaleString()} Units</p>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">(Standard Batch)</span>
                            </div>
                            <div className="h-1 bg-slate-100 w-full" />
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Delivery Deadline</span>
                                <p className="font-black uppercase text-2xl text-slate-900">
                                    {new Date(bid.job.deadline).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
                                </p>
                            </div>
                            <div className="h-1 bg-slate-100 w-full" />
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Client</span>
                                <p className="font-black uppercase text-2xl text-slate-900">{clientName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-4 border-slate-900 shadow-[8px_8px_0px_#0F172A] overflow-hidden group relative">
                        <img
                            src="https://images.unsplash.com/photo-1590001000181-7994784a9235?q=80&w=800&auto=format&fit=crop"
                            alt="Reference"
                            className="w-full h-72 object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute bottom-4 left-4 bg-white border-2 border-slate-900 p-2 text-[8px] font-black uppercase">
                            REF: V-902 PRECISION MACHINE
                        </div>
                    </div>

                    <div className="bg-[#4ade80] border-4 border-slate-900 p-8 shadow-[8px_8px_0px_#0F172A]">
                        <h3 className="text-xs font-black uppercase text-slate-900 tracking-widest mb-4">Technical Note</h3>
                        <p className="text-xs font-bold text-emerald-900 leading-relaxed uppercase">
                            Revisions exceeding 10% of the original bid value require secondary verification from the regional manufacturing lead.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t-4 border-slate-900 flex gap-4 z-50">
                <Link href="/vendor/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full h-16 border-4 border-slate-900 rounded-none font-black uppercase shadow-[4px_4px_0px_#0F172A]">
                        Save Draft
                    </Button>
                </Link>
                <Button className="flex-1 h-16 bg-[#f97316] text-white border-4 border-slate-900 rounded-none font-black uppercase shadow-[4px_4px_0px_#0F172A] flex items-center justify-center gap-2">
                    Submit Quote <Send className="h-4 w-4" />
                </Button>
            </div>

            {/* Gallery (Desktop Only) */}
            <div className="hidden lg:grid grid-cols-3 gap-10 p-10 mt-10 border-t-4 border-slate-200 bg-white">
                {['Shop Floor A-9', 'Material Yard', 'Assembly Lab'].map((label) => (
                    <div key={label} className="relative h-64 border-4 border-slate-900 group overflow-hidden shadow-[8px_8px_0px_#0F172A]">
                        <img
                            src={`https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop&sig=${label}`}
                            alt={label}
                            className="w-full h-full object-cover opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 flex items-end p-8">
                            <h3 className="text-2xl font-[1000] text-slate-900 uppercase">{label}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
