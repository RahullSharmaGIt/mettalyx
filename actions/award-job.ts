"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole, BidRejectionReason } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface LosingBidFeedback {
    bidId: string;
    reason: BidRejectionReason | null;
    note: string | null;
}

export async function awardJob(
    jobId: string,
    winningVendorId: string,
    winningBidId: string,
    winningPrice: number,
    losingBidsFeedback: LosingBidFeedback[]
) {
    const session = await auth();

    if (!session || session.user.role !== UserRole.ADMIN) {
        throw new Error("Unauthorized");
    }

    // Execute in a transaction to ensure all states update atomically
    await (prisma as any).$transaction(async (tx: any) => {
        // 1. Update the Job
        await tx.job.update({
            where: { id: jobId },
            data: {
                status: "ASSIGNED",
                vendorId: winningVendorId,
                targetVendorPrice: winningPrice // Log the final agreed price
                // Note: We don't overwrite minPriceFloor, keep it for records
            }
        });

        // 2. Mark the winning Bid
        await tx.bid.update({
            where: { id: winningBidId },
            data: {
                status: "WON"
            }
        });

        // 3. Mark losing bids
        for (const feedback of losingBidsFeedback) {
            await tx.bid.update({
                where: { id: feedback.bidId },
                data: {
                    status: "REJECTED",
                    rejectionReason: feedback.reason,
                    adminFeedback: feedback.note
                }
            });
        }

        // 4. Log the action
        await tx.jobStatusLog.create({
            data: {
                jobId,
                status: "ASSIGNED",
                changedBy: session.user.id,
                note: `Job awarded to vendor: ${winningVendorId}`
            }
        });
    });

    revalidatePath("/admin/oem");
    revalidatePath(`/admin/jobs/${jobId}`);
}
