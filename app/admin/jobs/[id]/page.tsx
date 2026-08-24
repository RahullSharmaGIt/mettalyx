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
import { AssignVendorDialog } from "@/components/admin/assign-vendor-dialog";
import { AwardJobDialog } from "@/components/admin/award-job-dialog";
import { SecureFileLink } from "@/components/shared/secure-file-link";
import {
    ArrowLeft,
    Package,
    Calendar,
    MapPin,
    Layers,
    Sliders,
    Palette,
    CheckCircle,
    Building2,
    Zap,
    FileText,
    ShieldCheck,
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

const AdminJobDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id: jobId } = await params;
    const session = await auth();

    if (!session || session.user.role !== UserRole.ADMIN) {
        redirect("/auth/login");
    }

    // Admin sees full job including OEM name (they ARE the middleman)
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
            oem: { select: { id: true, name: true, email: true, companyName: true } },
            vendor: { select: { id: true, vendorProfile: { select: { companyName: true, city: true, status: true } } } },
            files: { select: { id: true, originalName: true } },
            logs: { orderBy: { createdAt: "asc" } },
            bids: {
                include: {
                    vendor: {
                        select: { name: true, companyName: true, vendorProfile: { select: { yearsOfExperience: true, certifications: true } } }
                    }
                }
            },
        },
    });

    if (!job) notFound();

    // Find VERIFIED vendors and score them against job requirements
    const vendors = await prisma.vendorProfile.findMany({
        where: { status: "VERIFIED", isOnboarded: true },
        include: {
            capabilities: { select: { capabilities: true, expertiseLevel: true } },
            user: { select: { id: true } },
        },
        orderBy: { city: "asc" },
    });

    // Score vendor capability match
    const score = (caps: unknown): number => {
        if (!Array.isArray(caps)) return 0;
        const jobMaterial = job.material.toLowerCase();
        const hits = (caps as string[]).filter((c) =>
            c.toLowerCase().includes("cnc") ||
            c.toLowerCase().includes("machining") ||
            c.toLowerCase().includes(jobMaterial)
        );
        return hits.length;
    };

    const rankedVendors = vendors
        .map((v) => ({ ...v, matchScore: score(v.capabilities?.capabilities) }))
        .sort((a, b) => b.matchScore - a.matchScore);

    const isAssignable = job.status === "OPEN";
    const currentVendorId = job.vendorId;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/oem">
                    <Button variant="ghost" size="sm" className="rounded-lg text-xs text-slate-600"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Jobs</Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">{job.title}</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        By {job.oem.companyName || job.oem.name} ({job.oem.email}) ·{" "}
                        {new Date(job.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                    </p>
                </div>
                <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200 text-xs rounded-md font-medium">
                    {job.status.replace(/_/g, " ")}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: full specs */}
                <div className="lg:col-span-2 space-y-5">
                    <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3.5 px-5">
                            <CardTitle className="text-xs font-semibold uppercase text-slate-500">Job Specifications</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 grid grid-cols-2 gap-4">
                            <Spec icon={<Package />} label="Material" value={job.material} />
                            {job.materialGrade && <Spec icon={<Layers />} label="Material Grade" value={job.materialGrade} />}
                            <Spec icon={<Package />} label="Quantity" value={`${job.quantity} units`} />
                            {job.tolerance && <Spec icon={<Sliders />} label="Tolerance" value={job.tolerance} />}
                            {job.surfaceFinish && <Spec icon={<Palette />} label="Surface Finish" value={job.surfaceFinish} />}
                            <Spec icon={<Calendar />} label="Deadline" value={new Date(job.deadline).toLocaleDateString("en-IN", { dateStyle: "long" })} />
                            <Spec icon={<MapPin />} label="Location" value={job.location} />
                        </CardContent>
                    </Card>

                    {job.description && (
                        <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3.5 px-5">
                                <CardTitle className="text-xs font-semibold uppercase text-slate-500">Description</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <p className="text-xs text-slate-700 leading-relaxed">{job.description}</p>
                            </CardContent>
                        </Card>
                    )}

                    {job.files.length > 0 && (
                        <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3.5 px-5">
                                <CardTitle className="text-xs font-semibold uppercase text-slate-500">Attached Files</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-2">
                                {job.files.map((f) => (
                                    <SecureFileLink
                                        key={f.id}
                                        fileId={f.id}
                                        originalName={f.originalName}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Bid Analysis — visible only to Admin */}
                    {job.bids.length > 0 ? (
                        <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3.5 px-5">
                                <CardTitle className="text-xs font-semibold uppercase text-slate-900">
                                    Bid Analysis ({job.bids.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b">
                                        <tr>
                                            <th className="px-4 py-3">Vendor</th>
                                            <th className="px-4 py-3">Price</th>
                                            <th className="px-4 py-3">Lead Time</th>
                                            <th className="px-4 py-3">Profile / ISO</th>
                                            <th className="px-4 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {job.bids.map((bid) => {
                                            const vProfile = bid.vendor.vendorProfile;
                                            const certs = vProfile?.certifications || [];
                                            const hasISO = certs.some((c: any) => c.name.toLowerCase().includes("iso"));

                                            // Savings calculation vs budget
                                            let budgetDiffHtml = null;
                                            if (job.targetVendorPrice) {
                                                const diff = job.targetVendorPrice - bid.proposedPrice;
                                                const pct = ((diff / job.targetVendorPrice) * 100).toFixed(1);
                                                if (diff > 0) {
                                                    budgetDiffHtml = <span className="text-emerald-600 block text-xs font-medium">-{pct}% vs budget</span>;
                                                } else if (diff < 0) {
                                                    budgetDiffHtml = <span className="text-red-600 block text-xs font-medium">+{Math.abs(Number(pct))}% over budget</span>;
                                                } else {
                                                    budgetDiffHtml = <span className="text-slate-500 block text-xs">On budget</span>;
                                                }
                                            }

                                            // Build losing bids array for this specific row (if awarded)
                                            const losingBids = job.bids
                                                .filter(b => b.id !== bid.id)
                                                .map(b => ({
                                                    id: b.id,
                                                    vendorName: b.vendor.companyName || b.vendor.name || "Unknown"
                                                }));

                                            return (
                                                <tr key={bid.id} className="hover:bg-slate-50">
                                                    <td className="px-4 py-3 font-medium text-slate-900">
                                                        {bid.vendor.companyName || bid.vendor.name}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="font-semibold">₹{bid.proposedPrice.toLocaleString()}</span>
                                                        {budgetDiffHtml}
                                                    </td>
                                                    <td className="px-4 py-3">{bid.proposedLeadTime} Days</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-1.5 flex-wrap">
                                                            {vProfile?.yearsOfExperience ? (
                                                                <Badge variant="outline" className="text-xs bg-white text-slate-600">
                                                                    {vProfile.yearsOfExperience} Yrs Exp
                                                                </Badge>
                                                            ) : null}
                                                            {hasISO && (
                                                                <Badge className="bg-emerald-100 text-emerald-800 border-none text-xs">
                                                                    <ShieldCheck className="h-3 w-3 mr-1" /> ISO Certified
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        {isAssignable ? (
                                                            <AwardJobDialog
                                                                jobId={job.id}
                                                                winningBidId={bid.id}
                                                                winningVendorId={bid.vendorId}
                                                                winningVendorName={bid.vendor.companyName || bid.vendor.name!}
                                                                winningPrice={bid.proposedPrice}
                                                                losingBids={losingBids}
                                                            />
                                                        ) : (
                                                            bid.status === "WON"
                                                                ? <Badge className="bg-emerald-500 hover:bg-emerald-600">Winner</Badge>
                                                                : <Badge variant="secondary">{bid.status}</Badge>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3.5 px-5">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xs font-semibold uppercase text-slate-500">
                                        Verified Vendors {rankedVendors.length > 0 && `(${rankedVendors.length})`}
                                    </CardTitle>
                                    {!isAssignable && (
                                        <span className="text-xs text-slate-400 font-medium">
                                            Job must be OPEN to assign
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {rankedVendors.length === 0 ? (
                                    <p className="p-5 text-xs text-slate-400 text-center italic">No verified vendors available</p>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {rankedVendors.map((vendor) => {
                                            const caps = Array.isArray(vendor.capabilities?.capabilities)
                                                ? (vendor.capabilities!.capabilities as string[])
                                                : [];
                                            const isCurrentVendor = vendor.user.id === currentVendorId;

                                            return (
                                                <div
                                                    key={vendor.id}
                                                    className={`flex items-center justify-between p-4 ${isCurrentVendor ? "bg-slate-50" : "hover:bg-slate-50/60"}`}
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                                                            <p className="text-xs font-semibold text-slate-800">
                                                                {vendor.city ?? "Region unavailable"}
                                                            </p>
                                                            {isCurrentVendor && (
                                                                <Badge className="bg-slate-900 text-white text-[10px] rounded-md">Currently Assigned</Badge>
                                                            )}
                                                            {vendor.matchScore > 0 && (
                                                                <Badge variant="outline" className="text-emerald-700 border-emerald-300 text-[10px] rounded-md">
                                                                    <Zap className="h-2.5 w-2.5 mr-1" /> Capability Match
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {caps.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-1.5 ml-6">
                                                                {caps.slice(0, 4).map((c) => (
                                                                    <span key={c} className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">{c}</span>
                                                                ))}
                                                                {caps.length > 4 && (
                                                                    <span className="text-[10px] text-slate-400">+{caps.length - 4} more</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4 shrink-0">
                                                        {isAssignable ? (
                                                            <AssignVendorDialog
                                                                jobId={jobId}
                                                                vendorId={vendor.user.id}
                                                                vendorDisplayName={`Vendor — ${vendor.city ?? "Unknown Region"}`}
                                                            />
                                                        ) : (
                                                            <Button size="sm" variant="outline" disabled className="rounded-lg text-xs">Assign</Button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right: status + current vendor */}
                <div className="space-y-5">
                    {/* Current assignment */}
                    {currentVendorId && job.vendor && (
                        <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3.5 px-5">
                                <CardTitle className="text-xs font-semibold uppercase text-slate-900 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-slate-700" />
                                    Assigned Partner
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <p className="font-semibold text-slate-800 text-xs">
                                    {job.vendor.vendorProfile?.companyName}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {job.vendor.vendorProfile?.city}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Status Log */}
                    {job.logs.length > 0 && (
                        <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3.5 px-5">
                                <CardTitle className="text-xs font-semibold uppercase text-slate-500">Status Log</CardTitle>
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
                                                <p className="text-xs font-semibold text-slate-800">
                                                    {log.status.replace(/_/g, " ")}
                                                </p>
                                                {log.note && <p className="text-xs text-slate-500 mt-0.5">{log.note}</p>}
                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    {new Date(log.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick stats */}
                    <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white">
                        <CardContent className="p-5 space-y-3">
                            <div className="flex items-center gap-2 text-xs">
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                                <span className="text-slate-500">Status:</span>
                                <span className="font-semibold text-slate-800">{job.status.replace(/_/g, " ")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-500">Due:</span>
                                <span className="font-semibold text-slate-800">{new Date(job.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <Package className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-500">Qty:</span>
                                <span className="font-semibold text-slate-800">{job.quantity} units</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const Spec = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-start gap-2.5">
        <div className="h-4 w-4 text-slate-400 mt-0.5 shrink-0">{icon}</div>
        <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">{label}</p>
            <p className="text-sm font-medium text-slate-800">{value}</p>
        </div>
    </div>
);

export default AdminJobDetailPage;
