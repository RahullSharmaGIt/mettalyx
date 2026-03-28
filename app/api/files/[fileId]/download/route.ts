import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateDownloadUrl } from "@/lib/s3";

/**
 * GET /api/files/[fileId]/download
 *
 * Authorization rules (enforced server-side, no exceptions):
 * ┌────────┬────────────────────────────────────────────────────────────────┐
 * │ ADMIN  │ Always allowed                                                  │
 * │ OEM    │ Only if job.oemId === session.user.id                           │
 * │ VENDOR │ Only if job.vendorId === session.user.id                        │
 * │        │ AND job.status in { ASSIGNED, IN_PROGRESS, QC, COMPLETED }     │
 * └────────┴────────────────────────────────────────────────────────────────┘
 *
 * On success:
 *  1. Generate 10-min presigned GET URL
 *  2. Write audit entry to JobStatusLog
 *  3. Return { url } — never stored client-side
 */
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ fileId: string }> }
) {
    try {
        const { fileId } = await params;
        const session = await auth();

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch the file + its parent job
        const jobFile = await prisma.jobFile.findUnique({
            where: { id: fileId },
            include: {
                job: {
                    select: {
                        id: true,
                        oemId: true,
                        vendorId: true,
                        status: true,
                    },
                },
            },
        });

        if (!jobFile) {
            return new NextResponse("File not found", { status: 404 });
        }

        const { job } = jobFile;

        // Files that haven't been linked to a job yet (still in DRAFT state)
        // cannot be downloaded — they have no access context to evaluate.
        if (!job) {
            return new NextResponse("File not linked to a job", { status: 404 });
        }

        const userId = session.user.id as string;
        const role = session.user.role;

        // ─── Authorization ─────────────────────────────────────────────────────
        let allowed = false;

        if (role === "ADMIN") {
            allowed = true;
        } else if (role === "OEM" && job.oemId === userId) {
            allowed = true;
        } else if (role === "VENDOR") {
            const vendorStatuses = ["ASSIGNED", "IN_PROGRESS", "QC", "COMPLETED"];
            if (
                job.vendorId === userId &&
                vendorStatuses.includes(job.status)
            ) {
                allowed = true;
            }
        }

        if (!allowed) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // ─── Generate presigned download URL (Transient 15-minute Access) ──────
        const url = await generateDownloadUrl(jobFile.fileKey, jobFile.originalName, 15 * 60);

        // ─── Audit log ─────────────────────────────────────────────────────────
        await prisma.jobStatusLog.create({
            data: {
                jobId: job.id,
                status: job.status,
                changedBy: userId,
                note: `File "${jobFile.originalName}" downloaded by ${role} [${userId}]`,
            },
        });

        // ─── Secure Handover Log (FileAccessLog) ───────────────────────────────
        const ipAddress = _req.headers.get("x-forwarded-for") || _req.headers.get("remote-addr") || null;
        await prisma.fileAccessLog.create({
            data: {
                userId,
                fileId,
                jobId: job.id,
                ipAddress
            }
        });

        return NextResponse.json({ url });
    } catch (err) {
        console.error("[FILES_DOWNLOAD]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

