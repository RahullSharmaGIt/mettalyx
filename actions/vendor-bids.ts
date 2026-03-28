"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getOpenJobsForBidding() {
    const session = await auth();
    if (!session || session.user.role !== "VENDOR") {
        throw new Error("Unauthorized");
    }

    const vendorId = session.user.id as string;

    // Verify vendor is VERIFIED
    const vendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId: vendorId },
        select: { status: true },
    });

    if (vendorProfile?.status !== "VERIFIED") {
        throw new Error("Vendor must be verified to view bids.");
    }

    // Fetch OPEN jobs, excluding OEM data, including bid aggregations
    // Using Prisma raw or doing it manually because we need aggregates.
    // Easiest is to fetch jobs with their bids, then calculate.
    const jobs = await prisma.job.findMany({
        where: { status: "OPEN" },
        select: {
            id: true,
            title: true,
            material: true,
            quantity: true,
            location: true,
            targetVendorPrice: true,
            minPriceFloor: true,
            createdAt: true,
            bids: {
                select: {
                    proposedPrice: true,
                    vendorId: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return jobs.map((job) => {
        const lowestBid = job.bids.length > 0
            ? Math.min(...job.bids.map(b => b.proposedPrice))
            : null;

        const hasBid = (job as any).bids.some((b: any) => b.vendorId === vendorId);

        return {
            id: job.id,
            title: job.title,
            material: job.material,
            quantity: job.quantity,
            location: job.location,
            targetVendorPrice: job.targetVendorPrice,
            minPriceFloor: job.minPriceFloor,
            createdAt: job.createdAt,
            totalBids: (job as any).bids.length,
            lowestBid,
            hasBid,
        };
    });
}

export async function submitBid(jobId: string, price: number, leadTime: number, notes: string) {
    const session = await auth();
    if (!session || session.user.role !== "VENDOR") {
        throw new Error("Unauthorized");
    }

    const vendorId = session.user.id as string;

    const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { status: true, minPriceFloor: true },
    });

    if (!job || job.status !== "OPEN") {
        throw new Error("This job is no longer open for bidding.");
    }

    if (job.minPriceFloor !== null && price < job.minPriceFloor) {
        throw new Error("Bid price is below the required minimum floor.");
    }

    // Upsert the bid
    await prisma.bid.upsert({
        where: {
            vendorId_jobId: { vendorId, jobId },
        },
        update: {
            proposedPrice: price,
            proposedLeadTime: leadTime,
            notes,
            status: "PENDING",
        },
        create: {
            vendorId,
            jobId,
            proposedPrice: price,
            proposedLeadTime: leadTime,
            notes,
            status: "PENDING",
        },
    });
}

export async function updateBid(bidId: string, newPrice: number, newLeadTime: number, newNotes: string) {
    const session = await auth();
    if (!session || session.user.role !== "VENDOR") {
        throw new Error("Unauthorized");
    }

    const vendorId = session.user.id as string;

    const bid = await prisma.bid.findUnique({
        where: { id: bidId },
        include: { job: { select: { status: true, minPriceFloor: true } } }
    });

    if (!bid || bid.vendorId !== vendorId) {
        throw new Error("Bid not found or access denied.");
    }

    if (bid.job.status !== "OPEN") {
        throw new Error("This job is no longer open. Revisions are closed.");
    }

    if (bid.isLocked && bid.updateCount >= 1) {
        throw new Error("Bid is locked. Request an unlock from the admin.");
    }

    if (newPrice > bid.proposedPrice) {
        throw new Error("Revised price must be equal to or lower than your current bid.");
    }

    if (bid.job.minPriceFloor !== null && newPrice < bid.job.minPriceFloor) {
        throw new Error("Bid price is below the required minimum floor.");
    }

    const currentUpdateCount = (bid as any).updateCount || 0;
    const newUpdateCount = currentUpdateCount + 1;
    const shouldLock = newUpdateCount >= 1;

    await (prisma as any).bid.update({
        where: { id: bidId },
        data: {
            proposedPrice: newPrice,
            proposedLeadTime: newLeadTime,
            notes: newNotes,
            updateCount: newUpdateCount,
            isLocked: shouldLock,
            unlockRequested: false // clear flag if it was unlocked
        }
    });
}

export async function requestBidUnlock(bidId: string) {
    const session = await auth();
    if (!session || session.user.role !== "VENDOR") {
        throw new Error("Unauthorized");
    }

    const vendorId = session.user.id as string;

    const bid = await prisma.bid.findUnique({
        where: { id: bidId }
    });

    if (!bid || bid.vendorId !== vendorId) {
        throw new Error("Bid not found or access denied.");
    }

    if (!bid.isLocked) {
        throw new Error("Bid is already unlocked.");
    }

    await prisma.bid.update({
        where: { id: bidId },
        data: {
            unlockRequested: true
        }
    });
}
