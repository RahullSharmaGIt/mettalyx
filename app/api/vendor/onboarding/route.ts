import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { VendorOnboardingSchema } from "@/schemas";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || session.user.role !== "VENDOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = session.user.id;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const validatedFields = VendorOnboardingSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json({ error: "Invalid fields!", details: validatedFields.error.format() }, { status: 400 });
        }

        const data = validatedFields.data;

        // Start a transaction to ensure all related data is created safely
        await prisma.$transaction(async (tx) => {
            // Update User table
            await tx.user.update({
                where: { id: userId },
                data: { companyName: data.companyName },
            });

            // Upsert VendorProfile
            const vendorProfile = await tx.vendorProfile.upsert({
                where: { userId },
                create: {
                    userId,
                    companyName: data.companyName,
                    contactPhone: data.contactPhone,
                    contactEmail: data.contactEmail,
                    gstNumber: data.gstNumber,
                    address: data.address,
                    city: data.city,
                    lat: data.lat,
                    lng: data.lng,
                    yearsOfExperience: data.yearsOfExperience,
                    industriesServed: data.industriesServed ? data.industriesServed : [],
                    isAgreementAccepted: data.isAgreementAccepted,
                    isOnboarded: true,
                    status: "PENDING",
                },
                update: {
                    companyName: data.companyName,
                    contactPhone: data.contactPhone,
                    contactEmail: data.contactEmail,
                    gstNumber: data.gstNumber,
                    address: data.address,
                    city: data.city,
                    lat: data.lat,
                    lng: data.lng,
                    yearsOfExperience: data.yearsOfExperience,
                    industriesServed: data.industriesServed ? data.industriesServed : [],
                    isAgreementAccepted: data.isAgreementAccepted,
                    isOnboarded: true,
                },
            });

            const profileId = vendorProfile.id;

            // Handle Capabilities
            // Since it's a 1-to-1 or 1-to-many depending on the schema, let's clean old capabilities and insert new
            await tx.vendorCapability.deleteMany({
                where: { vendorId: profileId },
            });

            await tx.vendorCapability.create({
                data: {
                    vendorId: profileId,
                    capabilities: data.capabilities,
                    expertiseLevel: data.expertiseLevel,
                    tolerancesSupported: data.tolerancesSupported,
                    maxPartSize: data.maxPartSize,
                    minPartSize: data.minPartSize,
                }
            });

            // Handle Certifications
            await tx.vendorCertification.deleteMany({
                where: { vendorId: profileId }
            });

            if (data.certifications && data.certifications.length > 0) {
                await tx.vendorCertification.createMany({
                    data: data.certifications.map((cert) => ({
                        vendorId: profileId,
                        name: cert.name,
                        certificateUrl: cert.certificateUrl,
                        issuedBy: cert.issuedBy,
                        issuedDate: cert.issuedDate ? new Date(cert.issuedDate) : null,
                    }))
                });
            }

            // Handle Documents (Past Work, ISO, Quality, Compliance)
            await tx.vendorDocument.deleteMany({
                where: { vendorId: profileId }
            });

            const docsToInsert: { vendorId: string; name: string; url: string; type: string }[] = [];

            if (data.sampleWorkFiles) {
                data.sampleWorkFiles.forEach((url) => {
                    docsToInsert.push({ vendorId: profileId, name: "Sample Work", url, type: "SAMPLE_WORK" });
                });
            }
            if (data.isoCertificates) {
                data.isoCertificates.forEach((url) => {
                    docsToInsert.push({ vendorId: profileId, name: "ISO Certificate", url, type: "ISO_CERTIFICATE" });
                });
            }
            if (data.qualityDocuments) {
                data.qualityDocuments.forEach((url) => {
                    docsToInsert.push({ vendorId: profileId, name: "Quality Document", url, type: "QUALITY_DOCUMENT" });
                });
            }
            if (data.complianceProofs) {
                data.complianceProofs.forEach((url) => {
                    docsToInsert.push({ vendorId: profileId, name: "Compliance Proof", url, type: "COMPLIANCE_PROOF" });
                });
            }

            if (docsToInsert.length > 0) {
                await tx.vendorDocument.createMany({
                    data: docsToInsert
                });
            }
        });

        return NextResponse.json({ success: "Profile updated successfully!" }, { status: 200 });

    } catch (error) {
        console.error("[VENDOR_ONBOARDING_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
