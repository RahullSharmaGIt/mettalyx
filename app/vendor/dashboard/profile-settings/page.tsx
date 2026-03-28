import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ProfilePage, type VendorProfileData } from "@/components/vendor/profile/profile-page";

const ProfileSettingsPage = async () => {
    const session = await auth();

    if (!session || session.user.role !== UserRole.VENDOR) {
        redirect("/auth/login");
    }

    const profile = await prisma.vendorProfile.findUnique({
        where: { userId: session.user.id as string },
        include: {
            capabilities: true,
            certifications: true,
            documents: true,
        },
    });

    if (!profile?.isOnboarded) {
        redirect("/vendor/onboarding");
    }

    // Shape the data to match VendorProfileData
    const initialData: VendorProfileData = {
        companyName: profile.companyName,
        contactEmail: profile.contactEmail,
        contactPhone: profile.contactPhone,
        gstNumber: profile.gstNumber,
        yearsOfExperience: profile.yearsOfExperience,
        address: profile.address,
        city: profile.city,
        lat: profile.lat,
        lng: profile.lng,
        industriesServed: profile.industriesServed,
        pastWorkDescription: null,
        isAgreementAccepted: profile.isAgreementAccepted,
        capabilities: profile.capabilities
            ? {
                capabilities: profile.capabilities.capabilities,
                expertiseLevel: profile.capabilities.expertiseLevel,
                tolerancesSupported: profile.capabilities.tolerancesSupported,
                maxPartSize: profile.capabilities.maxPartSize,
                minPartSize: profile.capabilities.minPartSize,
            }
            : null,
        certifications: profile.certifications.map((c) => ({
            id: c.id,
            name: c.name,
            issuedBy: c.issuedBy,
            issuedDate: c.issuedDate,
            certificateUrl: c.certificateUrl,
        })),
        documents: profile.documents.map((d) => ({
            id: d.id,
            type: d.type,
            url: d.url,
            name: d.name,
        })),
    };

    return <ProfilePage initialData={initialData} />;
};

export default ProfileSettingsPage;
