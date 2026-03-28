import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const DocsSchema = z.object({
    isoCertificates: z.array(z.string()).optional().default([]),
    qualityDocuments: z.array(z.string()).optional().default([]),
    complianceProofs: z.array(z.string()).optional().default([]),
    sampleWorkFiles: z.array(z.string()).optional().default([]),
});

type DocType = "ISO_CERTIFICATE" | "QUALITY_DOCUMENT" | "COMPLIANCE_PROOF" | "SAMPLE_WORK";

// PUT /api/vendor/documents — replace all documents for the given type categories
export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "VENDOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const parsed = DocsSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid fields", details: parsed.error.format() }, { status: 400 });
        }

        const profile = await prisma.vendorProfile.findUnique({
            where: { userId: session.user.id as string },
            select: { id: true },
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const { isoCertificates, qualityDocuments, complianceProofs, sampleWorkFiles } = parsed.data;

        // Build the full list of documents to insert
        const toInsert: { vendorId: string; name: string; url: string; type: DocType }[] = [
            ...isoCertificates.map((url) => ({ vendorId: profile.id, name: "ISO Certificate", url, type: "ISO_CERTIFICATE" as DocType })),
            ...qualityDocuments.map((url) => ({ vendorId: profile.id, name: "Quality Document", url, type: "QUALITY_DOCUMENT" as DocType })),
            ...complianceProofs.map((url) => ({ vendorId: profile.id, name: "Compliance Proof", url, type: "COMPLIANCE_PROOF" as DocType })),
            ...sampleWorkFiles.map((url) => ({ vendorId: profile.id, name: "Sample Work", url, type: "SAMPLE_WORK" as DocType })),
        ];

        // Replace all documents in one transaction
        await prisma.$transaction(async (tx) => {
            await tx.vendorDocument.deleteMany({ where: { vendorId: profile.id } });
            if (toInsert.length > 0) {
                await tx.vendorDocument.createMany({ data: toInsert });
            }
        });

        const updated = await prisma.vendorDocument.findMany({
            where: { vendorId: profile.id },
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error("[VENDOR_DOCUMENTS_PUT]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
