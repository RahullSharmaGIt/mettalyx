import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const CertSchema = z.object({
    certifications: z.array(z.object({
        name: z.string().min(1),
        certificateUrl: z.string().min(1),
        issuedBy: z.string().optional(),
        issuedDate: z.string().optional(), // ISO string from JSON
    })),
});

// PUT /api/vendor/certifications — replace all certifications
export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "VENDOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const parsed = CertSchema.safeParse(body);
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

        await prisma.$transaction(async (tx) => {
            await tx.vendorCertification.deleteMany({ where: { vendorId: profile.id } });

            if (parsed.data.certifications.length > 0) {
                await tx.vendorCertification.createMany({
                    data: parsed.data.certifications.map((c) => ({
                        vendorId: profile.id,
                        name: c.name,
                        certificateUrl: c.certificateUrl,
                        issuedBy: c.issuedBy,
                        issuedDate: c.issuedDate ? new Date(c.issuedDate) : null,
                    })),
                });
            }
        });

        const updated = await prisma.vendorCertification.findMany({
            where: { vendorId: profile.id },
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error("[VENDOR_CERTIFICATIONS_PUT]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
