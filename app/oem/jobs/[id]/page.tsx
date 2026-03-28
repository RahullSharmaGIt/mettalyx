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
    FileText,
    ShieldCheck,
    Clock,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    PENDING_REVIEW: "bg-amber-500",
    OPEN: "bg-emerald-500",
    ASSIGNED: "bg-blue-500",
    IN_PROGRESS: "bg-purple-500",
    QC: "bg-indigo-500",
    COMPLETED: "bg-green-600",
    PAID: "bg-teal-600",
    CANCELLED: "bg-gray-500",
};

const OEMJobDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const session = await auth();

    if (!session || session.user.role !== UserRole.OEM) {
        redirect("/auth/login");
    }

    // Security: only fetch if this OEM owns the job — never expose vendor data
    const job = await prisma.job.findFirst({
        where: {
            id,
            oemId: session.user.id as string, // Enforces ownership
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
            vendorId: true, // Only the boolean existence check
            createdAt: true,
            files: {
                select: { id: true, originalName: true },
            },
            logs: {
                select: {
                    id: true,
                    status: true,
                    note: true,
                    createdAt: true,
                    // changedBy is intentionally excluded — OEM doesn't need to know who changed it
                },
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (!job) notFound();

    const isAssigned = !!job.vendorId;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            {/* Back + header */}
            <div className="flex items-center gap-4">
                <Link href="/oem/dashboard">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">{job.title}</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Posted {new Date(job.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                    </p>
                </div>
                <Badge className={STATUS_COLORS[job.status] ?? "bg-gray-400"}>
                    {job.status.replace(/_/g, " ")}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Left: job details */}
                <div className="md:col-span-2 space-y-5">
                    {/* Specifications */}
                    <Card className="border-2 border-slate-900">
                        <CardHeader className="border-b-2 border-slate-900 bg-slate-50 py-4 px-5">
                            <CardTitle className="text-base font-bold uppercase">Job Specifications</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 grid grid-cols-2 gap-4">
                            <SpecRow icon={<Package />} label="Material" value={job.material} />
                            {job.materialGrade && <SpecRow icon={<Layers />} label="Material Grade" value={job.materialGrade} />}
                            <SpecRow icon={<Package />} label="Quantity" value={`${job.quantity} units`} />
                            {job.tolerance && <SpecRow icon={<Sliders />} label="Tolerance" value={job.tolerance} />}
                            {job.surfaceFinish && <SpecRow icon={<Palette />} label="Surface Finish" value={job.surfaceFinish} />}
                            <SpecRow icon={<Calendar />} label="Deadline" value={new Date(job.deadline).toLocaleDateString("en-IN", { dateStyle: "long" })} />
                            <SpecRow icon={<MapPin />} label="Location" value={job.location} />
                        </CardContent>
                    </Card>

                    {/* Description */}
                    {job.description && (
                        <Card className="border-2 border-slate-900">
                            <CardHeader className="border-b-2 border-slate-900 bg-slate-50 py-4 px-5">
                                <CardTitle className="text-base font-bold uppercase">Description</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <p className="text-sm text-slate-700 leading-relaxed">{job.description}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Files — downloaded via signed URL, never raw link */}
                    {job.files.length > 0 && (
                        <Card className="border-2 border-slate-900">
                            <CardHeader className="border-b-2 border-slate-900 bg-slate-50 py-4 px-5">
                                <CardTitle className="text-base font-bold uppercase">Attached Files</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-2">
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

                {/* Right: status + partner */}
                <div className="space-y-5">
                    {/* Manufacturing partner — ANONYMIZED */}
                    <Card className="border-2 border-slate-900">
                        <CardHeader className="border-b-2 border-slate-900 bg-slate-50 py-4 px-5">
                            <CardTitle className="text-base font-bold uppercase">Manufacturing Partner</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            {isAssigned ? (
                                <div className="flex flex-col items-center gap-2 py-4 text-center">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <p className="font-semibold text-blue-800 text-sm">Manufacturing Partner Assigned</p>
                                    <p className="text-xs text-slate-500">
                                        METALLYX has matched a verified partner to fulfil this job. Partner details are managed by our team.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 py-4 text-center">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="font-semibold text-slate-600 text-sm">Awaiting Assignment</p>
                                    <p className="text-xs text-slate-400">
                                        Our team will assign a manufacturing partner once the job is approved.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Status Timeline */}
                    {job.logs.length > 0 && (
                        <Card className="border-2 border-slate-900">
                            <CardHeader className="border-b-2 border-slate-900 bg-slate-50 py-4 px-5">
                                <CardTitle className="text-base font-bold uppercase">Status History</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <div className="space-y-3">
                                    {job.logs.map((log, i) => (
                                        <div key={log.id} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 ${i === job.logs.length - 1 ? "bg-slate-900" : "bg-slate-300"}`} />
                                                {i < job.logs.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1 mb-1" />}
                                            </div>
                                            <div className="pb-3">
                                                <p className="text-xs font-bold uppercase text-slate-700">
                                                    {log.status.replace(/_/g, " ")}
                                                </p>
                                                {log.note && <p className="text-xs text-slate-500 mt-0.5">{log.note}</p>}
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {new Date(log.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
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
            <p className="text-sm font-medium text-slate-800">{value}</p>
        </div>
    </div>
);

export default OEMJobDetailPage;
