import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";
import { promoteFile, generateDownloadUrl } from "@/lib/s3";
import { randomUUID } from "crypto";
import path from "path";

/**
 * Allowed file extensions for manufacturing job attachments.
 * Validated server-side — NEVER trust client mimeType alone.
 */
const ALLOWED_EXTENSIONS = new Set([
    ".pdf",
    ".jpg", ".jpeg", ".png", ".webp",       // images / scans
    ".step", ".stp", ".stl", ".iges", ".igs", // 3D CAD
    ".dwg", ".dxf",                           // 2D CAD drawings
]);

/**
 * POST /api/files/confirm
 * Body: { fileKey, originalName, mimeType, size, jobId }
 *
 * Steps:
 * 1. Validate extension against allowlist
 * 2. Validate OEM owns the job
 * 3. Copy S3 object from pending/ → files/ (orphan cleanup)
 * 4. Delete pending/ version
 * 5. Create JobFile DB row with fileId only
 * Returns: { fileId }
 */
export async function POST(req: Request) {
    const session = await auth();

    if (!session || session.user.role !== UserRole.OEM) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { fileKey, originalName, mimeType, size, jobId } = body as {
        fileKey: string;
        originalName: string;
        mimeType: string;
        size: number;
        jobId: string;
    };

    if (!fileKey || !originalName) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ─── MIME / Extension Allowlist ────────────────────────────────────────────
    const ext = path.extname(originalName).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
            {
                error: `File type "${ext}" is not allowed. Accepted: .pdf, .jpg, .png, .step, .stl, .dwg, .dxf, and more.`,
            },
            { status: 415 } // 415 Unsupported Media Type
        );
    }

    // ─── Ownership check ───────────────────────────────────────────────────────
    // "DRAFT" is a sentinel meaning the job doesn't exist yet — the file is being
    // uploaded while the OEM fills out the form. The postJob action will link it
    // to the real job via updateMany after creation.
    if (jobId !== "DRAFT") {
        const job = await prisma.job.findFirst({
            where: { id: jobId, oemId: session.user.id as string },
            select: { id: true, status: true },
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found or not authorised" }, { status: 403 });
        }
    }

    // ─── Promote from pending/ → files/ ───────────────────────────────────────
    const confirmedKey = `files/${randomUUID()}${ext}`;

    try {
        await promoteFile(fileKey, confirmedKey);
    } catch (err) {
        console.error("[FILES_CONFIRM] S3 promote failed:", err);
        return NextResponse.json({ error: "File promotion failed" }, { status: 500 });
    }

    // ─── Create DB record ──────────────────────────────────────────────────────
    try {
        // For DRAFT files, jobId is null — the postJob action links them after creation
        // Prisma optional relations expect string | undefined, not string | null.
        const jobFile = await prisma.jobFile.create({
            data: {
                fileKey: confirmedKey,
                originalName,
                mimeType,
                size,
                uploadedBy: session.user.id as string,
                jobId: jobId === "DRAFT" ? undefined : jobId,
            },
        });

        console.log(`[FILES_CONFIRM] Created JobFile: ${jobFile.id}`);
        // Return ONLY the fileId — never the fileKey
        return NextResponse.json({ fileId: jobFile.id });
    } catch (err) {
        console.error("[FILES_CONFIRM] Prisma create failed:", err);
        const backendError = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: `Failed to create database record: ${backendError}` }, { status: 500 });
    }
}
