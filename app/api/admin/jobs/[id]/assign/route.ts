import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const AssignSchema = z.object({
    vendorId: z.string().min(1, "vendorId is required"),
});

// POST /api/admin/jobs/[id]/assign
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id: jobId } = await params;
        const body = await req.json();
        const parsed = AssignSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid payload", details: parsed.error.format() }, { status: 400 });
        }

        const { vendorId } = parsed.data;

        // Fetch the job — must be OPEN to assign
        const job = await prisma.job.findUnique({ where: { id: jobId } });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        if (job.status !== "OPEN") {
            return NextResponse.json(
                { error: `Cannot assign a job with status "${job.status}". Job must be OPEN.` },
                { status: 422 }
            );
        }

        // Verify the vendor exists and is VERIFIED
        const vendorProfile = await prisma.vendorProfile.findUnique({
            where: { userId: vendorId },
            select: { id: true, status: true },
        });

        if (!vendorProfile || vendorProfile.status !== "VERIFIED") {
            return NextResponse.json({ error: "Vendor is not verified" }, { status: 422 });
        }

        // Perform assignment + log in a transaction
        const updated = await prisma.$transaction(async (tx) => {
            const updatedJob = await tx.job.update({
                where: { id: jobId },
                data: {
                    vendorId,
                    status: "ASSIGNED",
                },
            });

            await tx.jobStatusLog.create({
                data: {
                    jobId,
                    status: "ASSIGNED",
                    changedBy: session.user.id as string,
                    note: "Vendor assigned by Admin",
                },
            });

            return updatedJob;
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error("[ADMIN_ASSIGN_JOB]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
