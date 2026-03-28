import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const CapabilitiesSchema = z.object({
    capabilities: z.array(z.string()).min(1, "Select at least one capability"),
    expertiseLevel: z.string().optional(),
    tolerancesSupported: z.string().optional(),
    maxPartSize: z.string().optional(),
    minPartSize: z.string().optional(),
});

// PUT /api/vendor/capabilities — upsert capability record
export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "VENDOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const parsed = CapabilitiesSchema.safeParse(body);
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

        const updated = await prisma.vendorCapability.upsert({
            where: { vendorId: profile.id },
            create: {
                vendorId: profile.id,
                ...parsed.data,
            },
            update: { ...parsed.data },
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error("[VENDOR_CAPABILITIES_PUT]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
