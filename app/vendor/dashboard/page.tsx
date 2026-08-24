import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Briefcase,
    FileText,
    Trophy,
    Ban,
    Activity,
    ArrowUpRight,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IndustrialStatCard } from "@/components/vendor/industrial-stat-card";
import { IndustrialBidPipeline } from "@/components/vendor/industrial-bid-pipeline";
import { IndustrialWonJobsList } from "@/components/vendor/industrial-won-jobs-list";
import { IndustrialPulse } from "@/components/vendor/industrial-pulse";

export const metadata = {
    title: "Vendor Dashboard | METALLYX",
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

    // Fetch bids with all necessary fields for updates
    const bids = await prisma.bid.findMany({
        where: { vendorId: session.user.id },
        include: {
            job: {
                select: {
                    id: true,
                    title: true,
                    material: true,
                    quantity: true,
                    status: true,
                    deadline: true,
                    minPriceFloor: true,
                }
            }
        },
        orderBy: { updatedAt: "desc" }
    });

    const pendingBids = bids.filter((b) => b.status === "PENDING");
    const wonBids = bids.filter((b) => b.status === "WON");
    const rejectedBids = bids.filter((b) => b.status === "REJECTED");

    // Map DB bids to Pipeline Props, including modal data
    const pipelineBids = pendingBids.slice(0, 3).map(b => ({
        id: b.jobId.slice(-8).toUpperCase(),
        bidId: b.id,
        title: b.job.title,
        qty: b.job.quantity,
        expiresIn: "48h", // Dynamic calculation later
        value: b.proposedPrice,
        proposedLeadTime: b.proposedLeadTime,
        notes: b.notes,
        updateCount: b.updateCount,
        isLocked: b.isLocked,
        unlockRequested: b.unlockRequested,
        minPriceFloor: b.job.minPriceFloor,
        isTopRanked: true,
        certified: true
    }));

    // Map DB bids to Won Jobs List Props
    const recentWonJobs = wonBids.slice(0, 5).map(b => ({
        id: b.jobId,
        title: b.job.title,
        wonTime: "2 HOURS AGO", // Dynamic later
        value: b.proposedPrice,
        status: (b.job.status === "IN_PROGRESS" ? "IN PRODUCTION" : "LOGISTICS PENDING") as any,
        isLocked: b.isLocked,
        updateCount: b.updateCount
    }));

    return (
        <div className="p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Vendor Dashboard
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                        <span className="text-xs text-slate-500 font-medium">
                            System Status: Operational • All Services Running
                        </span>
                    </div>
                </div>

                <Link href="/vendor/jobs">
                    <Button size="lg" className="h-11 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition-all font-medium text-sm">
                        <Search className="h-4 w-4 mr-2" />
                        Browse New RFQs
                    </Button>
                </Link>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <IndustrialStatCard
                    title="Active Bids"
                    value={pendingBids.length}
                    subtitle="Quotes in submission"
                    icon={FileText}
                    borderColor="border-slate-200"
                    textColor="text-slate-900"
                    trend="+2 from last week"
                />
                <IndustrialStatCard
                    title="Jobs Won"
                    value={wonBids.length}
                    subtitle="Total fulfillment rate: 94%"
                    icon={Trophy}
                    borderColor="border-slate-200"
                    textColor="text-slate-900"
                    statusIcon={Activity}
                />
                <IndustrialStatCard
                    title="Rejected"
                    value={rejectedBids.length.toString().padStart(2, '0')}
                    subtitle="Action required for RFQ-902"
                    icon={Ban}
                    borderColor="border-slate-200"
                    textColor="text-slate-900"
                />
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Column: Pipeline */}
                <div className="lg:col-span-2 space-y-6">
                    <IndustrialBidPipeline bids={pipelineBids} />

                    {/* Visual Insight Image Blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group relative h-[240px] rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <img
                                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"
                                alt="Factory"
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-6 flex flex-col justify-end">
                                <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1">Facility Insights</span>
                                <h3 className="text-lg font-bold text-white leading-snug">Optimization Protocol Alpha</h3>
                            </div>
                        </div>
                        <div className="group relative h-[240px] rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <img
                                src="https://plus.unsplash.com/premium_photo-1682144880138-9f1c0bfe6fa7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Quality"
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-6 flex flex-col justify-end">
                                <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1">Quality Control</span>
                                <h3 className="text-lg font-bold text-white leading-snug">99.8% Tolerance Accuracy</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Won Jobs & Pulse */}
                <div className="space-y-6">
                    <IndustrialWonJobsList jobs={recentWonJobs} />
                    <IndustrialPulse />

                    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-sm group cursor-pointer hover:bg-slate-800 transition-all">
                        <div className="flex justify-between items-start">
                            <h3 className="text-base font-semibold text-white leading-snug">Export Optimization Report</h3>
                            <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-3">
                            Available for Batch #409
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

