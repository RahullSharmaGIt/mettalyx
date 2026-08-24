import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SecureFileLink } from "@/components/shared/secure-file-link";
import {
    ArrowLeft,
    Package,
    Calendar,
    MapPin,
    Layers,
    Sliders,
    Palette,
    ShieldCheck,
    Clock,
    CheckCircle2,
    Truck,
    AlertCircle,
    Sparkles,
} from "lucide-react";

// Helper stage definitions for manufacturing progression
const STAGES = [
    { key: "PENDING_REVIEW", label: "Requirement Submitted", description: "Job posted by OEM & under admin verification" },
    { key: "OPEN", label: "Open for Bidding", description: "Verified manufacturing vendors placing quotes" },
    { key: "ASSIGNED", label: "Vendor Partner Matched", description: "Manufacturing partner assigned and tooling queued" },
    { key: "IN_PROGRESS", label: "In Production", description: "Machining, cutting, and fabrication underway" },
    { key: "QC", label: "Quality Control", description: "Tolerance verification & surface inspection" },
    { key: "COMPLETED", label: "Shipped & Delivered", description: "Job completed and delivered to site" },
];

const OEMJobDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const session = await auth();

    if (!session || session.user.role !== UserRole.OEM) {
        redirect("/auth/login");
    }

    // Security: fetch job details with bids and logs enforcing OEM ownership
    const job = await prisma.job.findFirst({
        where: {
            id,
            oemId: session.user.id as string,
        },
        select: {
            id: true,
            title: true,
            description: true,
            material: true,
            materialGrade: true,
            quantity: true,
            tolerance: true,
            surfaceFinish: true,
            deadline: true,
            location: true,
            status: true,
            vendorId: true,
            createdAt: true,
            updatedAt: true,
            files: {
                select: { id: true, originalName: true },
            },
            logs: {
                select: {
                    id: true,
                    status: true,
                    note: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "asc" },
            },
            bids: {
                select: {
                    vendorId: true,
                    proposedLeadTime: true,
                    status: true,
                },
            },
        },
    });

    if (!job) notFound();

    const isAssigned = !!job.vendorId;

    // Find the winning/assigned bid lead time if assigned
    const assignedBid = job.bids.find(
        (b) => (job.vendorId && b.vendorId === job.vendorId) || b.status === "WON"
    );
    const vendorLeadTimeDays = assignedBid?.proposedLeadTime ?? null;

    // Calculate delivery date based on assigned vendor lead time or OEM deadline
    const assignmentLog = job.logs.find((l) => l.status === "ASSIGNED");
    const assignmentDate = assignmentLog ? new Date(assignmentLog.createdAt) : new Date(job.createdAt);
    
    let estimatedDeliveryDate: Date;
    if (vendorLeadTimeDays) {
        estimatedDeliveryDate = new Date(assignmentDate.getTime() + vendorLeadTimeDays * 24 * 60 * 60 * 1000);
    } else {
        estimatedDeliveryDate = new Date(job.deadline);
    }

    const formattedDeliveryDate = estimatedDeliveryDate.toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const formattedOemDeadline = new Date(job.deadline).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    // Map log entries to stage dates
    const logDateMap = new Map<string, Date>();
    job.logs.forEach((l) => logDateMap.set(l.status, new Date(l.createdAt)));

    // Calculate current active stage index
    const stageKeys = STAGES.map((s) => s.key);
    let currentStageIndex = stageKeys.indexOf(job.status);
    if (currentStageIndex === -1) {
        if (job.status === "PAID") currentStageIndex = 5;
        else currentStageIndex = 0;
    }

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 bg-slate-50/50 min-h-screen">
            {/* Navigation Header */}
            <div className="flex items-center gap-4">
                <Link href="/oem/dashboard">
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-xs font-medium bg-white">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">{job.title}</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Job ID: <span className="font-mono text-slate-700">{job.id}</span> · Posted {new Date(job.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </p>
                </div>
                <Badge variant="outline" className="bg-slate-900 text-white border-slate-800 text-xs px-3 py-1 rounded-lg font-medium">
                    {job.status.replace(/_/g, " ")}
                </Badge>
            </div>

            {/* RELAXATION & DELIVERY AFFIRMATION BANNER */}
            <div className="border border-emerald-200 bg-emerald-50/80 rounded-2xl p-6 shadow-xs relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-emerald-950 tracking-tight">
                                    Guaranteed Delivery On Track
                                </h2>
                                <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
                            </div>
                            <p className="text-xs text-emerald-800 leading-relaxed max-w-xl">
                                Rest easy! METALLYX quality control & verified manufacturing partners ensure your parts are machined to spec and delivered by the committed schedule.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-emerald-200 rounded-xl p-4 flex flex-col items-center md:items-end justify-center min-w-[200px] shadow-xs">
                        <span className="text-[11px] uppercase font-bold text-emerald-600 tracking-wider">Final Promised Delivery</span>
                        <span className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                            {formattedDeliveryDate}
                        </span>
                        {vendorLeadTimeDays && (
                            <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                                Verified Vendor Commitment ({vendorLeadTimeDays} Days Lead)
                            </span>
                        )}
                        {!vendorLeadTimeDays && (
                            <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                                Target Deadline: {formattedOemDeadline}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* LIVE STAGE TIMELINE PROGRESS TRACKER */}
            <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-600" /> Live Manufacturing Timeline & Stage Progress
                        </CardTitle>
                        <span className="text-xs font-semibold text-slate-500">
                            Stage {currentStageIndex + 1} of {STAGES.length}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="relative">
                        {/* Progressive Stepper Line */}
                        <div className="space-y-6">
                            {STAGES.map((stage, idx) => {
                                const isPassed = idx < currentStageIndex;
                                const isCurrent = idx === currentStageIndex;
                                const logDate = logDateMap.get(stage.key);

                                return (
                                    <div key={stage.key} className="flex items-start gap-4 relative group">
                                        {/* Connecting Line */}
                                        {idx !== STAGES.length - 1 && (
                                            <div
                                                className={`absolute left-5 top-10 w-0.5 h-10 ${
                                                    idx < currentStageIndex ? "bg-emerald-500" : "bg-slate-200"
                                                }`}
                                            />
                                        )}

                                        {/* Stage Icon Circle */}
                                        <div
                                            className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                                                isPassed
                                                    ? "bg-emerald-600 text-white"
                                                    : isCurrent
                                                    ? "bg-slate-900 text-white ring-4 ring-slate-100"
                                                    : "bg-slate-100 text-slate-400 border border-slate-200"
                                            }`}
                                        >
                                            {isPassed ? (
                                                <CheckCircle2 className="h-5 w-5" />
                                            ) : isCurrent ? (
                                                <Clock className="h-5 w-5 animate-spin-slow" />
                                            ) : (
                                                <span className="text-xs font-bold">{idx + 1}</span>
                                            )}
                                        </div>

                                        {/* Stage Description & Timing */}
                                        <div className="flex-1 bg-slate-50/60 rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className={`text-sm font-bold ${isCurrent ? "text-slate-900" : isPassed ? "text-slate-800" : "text-slate-400"}`}>
                                                        {stage.label}
                                                    </h3>
                                                    {isCurrent && (
                                                        <Badge variant="outline" className="bg-slate-900 text-white text-[10px] px-2 py-0.2">
                                                            Current Stage
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5">{stage.description}</p>
                                            </div>

                                            <div className="text-right sm:text-right shrink-0">
                                                {logDate ? (
                                                    <span className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-mono">
                                                        {logDate.toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400 italic">Pending execution</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Job Specifications */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6">
                            <CardTitle className="text-xs font-semibold uppercase text-slate-500">Technical Specifications</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-2 gap-4">
                            <SpecRow icon={<Package />} label="Material" value={job.material} />
                            {job.materialGrade && <SpecRow icon={<Layers />} label="Material Grade" value={job.materialGrade} />}
                            <SpecRow icon={<Package />} label="Quantity" value={`${job.quantity} units`} />
                            {job.tolerance && <SpecRow icon={<Sliders />} label="Tolerance" value={job.tolerance} />}
                            {job.surfaceFinish && <SpecRow icon={<Palette />} label="Surface Finish" value={job.surfaceFinish} />}
                            <SpecRow icon={<Calendar />} label="OEM Deadline" value={formattedOemDeadline} />
                            <SpecRow icon={<MapPin />} label="Delivery Location" value={job.location} />
                        </CardContent>
                    </Card>

                    {job.description && (
                        <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6">
                                <CardTitle className="text-xs font-semibold uppercase text-slate-500">Requirement Notes</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-xs text-slate-700 leading-relaxed">{job.description}</p>
                            </CardContent>
                        </Card>
                    )}

                    {job.files.length > 0 && (
                        <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6">
                                <CardTitle className="text-xs font-semibold uppercase text-slate-500">Attached Blueprints & CAD Files</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-2">
                                {job.files.map((file) => (
                                    <SecureFileLink
                                        key={file.id}
                                        fileId={file.id}
                                        originalName={file.originalName}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right: Fulfillment & Partner Status */}
                <div className="space-y-6">
                    <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6">
                            <CardTitle className="text-xs font-semibold uppercase text-slate-500">Manufacturing Fulfillment Partner</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {isAssigned ? (
                                <div className="flex flex-col items-center gap-3 py-3 text-center">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Verified Partner Assigned</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            METALLYX has allocated a verified ISO-compliant manufacturing facility. Full production monitoring is managed directly by our team.
                                        </p>
                                    </div>
                                    {vendorLeadTimeDays && (
                                        <div className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-left">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Vendor Lead Time Commitment</span>
                                            <p className="text-xs font-semibold text-slate-800 font-mono mt-0.5">
                                                {vendorLeadTimeDays} Working Days
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 py-3 text-center">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 text-sm">Quotation & Matching Stage</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Manufacturing quotes are being analyzed. A verified partner will be assigned upon admin review.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Support Card */}
                    <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white p-6 space-y-3">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                            <AlertCircle className="h-4 w-4 text-slate-600" />
                            Need Support or Changes?
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Have questions regarding your order schedule or spec revisions? Your dedicated METALLYX account manager is assigned to oversee this job.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const SpecRow = ({ icon, label, value }: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => (
    <div className="flex items-start gap-2.5">
        <div className="h-4 w-4 text-slate-400 mt-0.5 shrink-0">{icon}</div>
        <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">{label}</p>
            <p className="text-sm font-semibold text-slate-800">{value}</p>
        </div>
    </div>
);

export default OEMJobDetailPage;
