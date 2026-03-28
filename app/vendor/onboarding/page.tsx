import { auth } from "@/auth";
import { OnboardingWizard } from "@/components/vendor/onboarding/onboarding-wizard";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

const VendorOnboardingPage = async () => {
    const session = await auth();

    if (!session || session.user.role !== UserRole.VENDOR) {
        redirect("/auth/login");
    }

    const vendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId: session.user.id as string },
    });

    // If already onboarded, redirect to dashboard
    if (vendorProfile?.isOnboarded) {
        redirect("/vendor/dashboard");
    }

    return <OnboardingWizard />;
};

export default VendorOnboardingPage;
