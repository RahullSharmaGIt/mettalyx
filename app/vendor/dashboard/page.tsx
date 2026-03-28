import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Briefcase, FileText, Ban, Trophy, Lock } from "lucide-react";
import { UpdateBidModal } from "@/components/vendor/update-bid-modal";
import { SecureFileLink } from "@/components/shared/secure-file-link";

export const metadata = {
    title: "Dashboard | Vendor",
};

export default async function VendorDashboardPage() {
    const session = await auth();

    if (!session || session.user.role !== UserRole.VENDOR) {
        redirect("/auth/login");
    }

    const vendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!vendorProfile?.isOnboarded) {
        redirect("/vendor/onboarding");
    }

    // Fetch bids
    const bids = await prisma.bid.findMany({
        where: { vendorId: session.user.id },
        include: {
            job: {
                select: {
                    title: true,
                    material: true,
                    quantity: true,
                    location: true,
                    minPriceFloor: true,
                    files: { select: { id: true, originalName: true } }
                }
            }
        },
        orderBy: { updatedAt: "desc" }
    });

    const pendingBids = bids.filter((b: any) => b.status === "PENDING");
    const wonBids = bids.filter((b: any) => b.status === "WON");
    const rejectedBids = bids.filter((b: any) => b.status === "REJECTED");

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Vendor Dashboard</h1>
                    <p className="text-slate-500 mt-2">Manage your quotes and track won jobs.</p>
                </div>
                {vendorProfile.status === "VERIFIED" && (
                    <Link href="/vendor/jobs">
                        <div className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Browse New RFQs
                        </div>
                    </Link>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-2 border-slate-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50 border-b border-slate-200">
                        <CardTitle className="text-sm font-bold uppercase text-slate-600">Active Bids</CardTitle>
                        <FileText className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-3xl font-black">{pendingBids.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-emerald-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-emerald-50 border-b border-emerald-200">
                        <CardTitle className="text-sm font-bold uppercase text-emerald-800">Jobs Won</CardTitle>
                        <Trophy className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-3xl font-black text-emerald-700">{wonBids.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-rose-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-rose-50 border-b border-rose-200">
                        <CardTitle className="text-sm font-bold uppercase text-rose-800">Rejected</CardTitle>
                        <Ban className="h-4 w-4 text-rose-600" />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-3xl font-black text-rose-700">{rejectedBids.length}</div>
                    </CardContent>
                </Card>
            </div>

            {vendorProfile.status === "PENDING" && (
                <Alert className="border-amber-200 bg-amber-50 text-amber-800">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertTitle>Pending Verification</AlertTitle>
                    <AlertDescription>
                        Your profile is currently under review by our admin team.
                        You will be notified once you are verified and can start accepting jobs.
                    </AlertDescription>
                </Alert>
            )}

            {/* Detail Sections */}
            <div className="space-y-8">
                {/* Active Bids */}
                <section>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900 mb-4 border-b-2 border-slate-200 pb-2">My Active Bids</h2>
                    {pendingBids.length === 0 ? (
                        <p className="text-slate-500 italic text-sm">No active bids.</p>
                    ) : (
                        <div className="grid gap-4">
                            {pendingBids.map((bid: any) => (
                                <div key={bid.id} className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm hover:border-slate-300 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-slate-900">{bid.job.title}</p>
                                            <p className="text-xs text-slate-500 mb-2">{bid.job.material} • {bid.job.quantity} units</p>

                                            <div className="flex items-center gap-2 mt-1">
                                                {bid.isLocked ? (
                                                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 cursor-help" title="This bid is locked from further edits without admin review.">
                                                        <Lock className="h-3 w-3 mr-1 inline" /> Locked
                                                    </Badge>
                                                ) : bid.updateCount < 1 ? (
                                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                        1 Free Revision
                                                    </Badge>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <div>
                                                <p className="font-bold text-lg leading-tight">₹{bid.proposedPrice.toLocaleString()}</p>
                                                <p className="text-xs text-slate-500">{bid.proposedLeadTime} Days Lead</p>
                                            </div>
                                            <div className="w-full min-w-[140px] mt-2">
                                                <UpdateBidModal
                                                    bidId={bid.id}
                                                    currentPrice={bid.proposedPrice}
                                                    currentLeadTime={bid.proposedLeadTime}
                                                    currentNotes={bid.notes}
                                                    updateCount={bid.updateCount}
                                                    isLocked={bid.isLocked}
                                                    unlockRequested={bid.unlockRequested}
                                                    minPriceFloor={bid.job.minPriceFloor}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Won Jobs */}
                <section>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-emerald-800 border-b-2 border-emerald-200 pb-2 mb-4">Won Jobs</h2>
                    {wonBids.length === 0 ? (
                        <p className="text-emerald-700/60 italic text-sm">No won jobs yet.</p>
                    ) : (
                        <div className="grid gap-4">
                            {wonBids.map((bid: any) => (
                                <div key={bid.id} className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center p-4 border-2 border-emerald-200 rounded-lg bg-emerald-50">
                                    <div className="flex-1">
                                        <p className="font-bold text-emerald-900">{bid.job.title}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <Badge className="bg-emerald-500 hover:bg-emerald-600">AWARDED</Badge>
                                            <span className="text-sm font-semibold text-emerald-800">₹{bid.proposedPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="shrink-0 w-full sm:w-64 space-y-2">
                                        {bid.job.files && bid.job.files.length > 0 ? (
                                            bid.job.files.map((file: any) => (
                                                <div key={file.id} className="bg-white rounded-md shadow-sm">
                                                    <SecureFileLink fileId={file.id} originalName={file.originalName} />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-emerald-700 italic">No files attached.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Rejected Bids */}
                {rejectedBids.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-tight text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Past Bids</h2>
                        <div className="grid gap-4 opacity-80">
                            {rejectedBids.map((bid: any) => (
                                <div key={bid.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-slate-900 line-through decoration-slate-400">{bid.job.title}</p>
                                            <Badge variant="secondary" className="mt-1 bg-slate-200 text-slate-600 hover:bg-slate-300">Not Awarded</Badge>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-slate-500 line-through">₹{bid.proposedPrice.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {(bid.rejectionReason || bid.adminFeedback) && (
                                        <div className="bg-white p-3 rounded border border-slate-100 text-sm flex gap-2 items-start shadow-sm">
                                            <Info className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                                            <div>
                                                {bid.rejectionReason === "PRICE" && <p className="font-medium text-slate-700">Feedback: Price was not competitive.</p>}
                                                {bid.rejectionReason === "LEAD_TIME" && <p className="font-medium text-slate-700">Feedback: Lead time was too long.</p>}
                                                {bid.rejectionReason === "GENERAL" && <p className="font-medium text-slate-700">Feedback: Job awarded to another partner.</p>}
                                                {bid.adminFeedback && (
                                                    <p className="text-slate-600 mt-1 italic">"{bid.adminFeedback}"</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

