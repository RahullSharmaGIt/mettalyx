import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { generateUploadUrl } from "@/lib/s3";
import { randomUUID } from "crypto";
import path from "path";

/**
 * GET /api/files/presign-upload?filename=drawing.pdf&mimeType=application/pdf
 *
 * Returns a presigned S3 PUT URL + the S3 key the client will use as a receipt.
 * File lands in `pending/` prefix. S3 lifecycle rule deletes it after 24h
 * if the OEM never completes the job submission.
 */
export async function GET(req: Request) {
    const session = await auth();

    if (!session || session.user.role !== UserRole.OEM) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename") ?? "file";
    const mimeType = searchParams.get("mimeType") ?? "application/octet-stream";

    // Build a UUID-based key — never leaks the original filename to S3
    const ext = path.extname(filename).toLowerCase() || "";
    const pendingKey = `pending/${session.user.id}-${randomUUID()}${ext}`;

    const uploadUrl = await generateUploadUrl(pendingKey, mimeType);

    return NextResponse.json({ uploadUrl, fileKey: pendingKey });
}
