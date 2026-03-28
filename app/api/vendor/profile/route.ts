import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const UpdateProfileSchema = z.object({
    companyName: z.string().min(1).optional(),
    contactPhone: z.string().optional(),
    contactEmail: z.string().email().optional(),
    gstNumber: z.string().optional(),
    yearsOfExperience: z.coerce.number().min(0).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    lat: z.number().nullable().optional(),
    lng: z.number().nullable().optional(),
    pastWorkDescription: z.string().optional(),
});

// GET /api/vendor/profile — fetch full profile + all relations
export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user.role !== "VENDOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const profile = await prisma.vendorProfile.findUnique({
            where: { userId: session.user.id as string },
            include: {
                capabilities: true,
                certifications: true,
                documents: true,
            },
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (err) {
        console.error("[VENDOR_PROFILE_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PUT /api/vendor/profile — update company details & basic fields
export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "VENDOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const parsed = UpdateProfileSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid fields", details: parsed.error.format() }, { status: 400 });
        }

        const data = parsed.data;

        // Also sync companyName to the User table if provided
        if (data.companyName) {
            await prisma.user.update({
                where: { id: session.user.id as string },
                data: { companyName: data.companyName },
            });
        }

        const updated = await prisma.vendorProfile.update({
            where: { userId: session.user.id as string },
            data: {
                companyName: data.companyName,
                contactPhone: data.contactPhone,
                contactEmail: data.contactEmail,
                gstNumber: data.gstNumber,
                yearsOfExperience: data.yearsOfExperience,
                address: data.address,
                city: data.city,
                lat: data.lat,
                lng: data.lng,
            },
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error("[VENDOR_PROFILE_PUT]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
