import { auth } from "@/auth";
import { VendorOnboardingForm } from "@/components/vendor/onboarding-form";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

const VendorOnboardingPage = async () => {
    const session = await auth();


    if (!session || session.user.role !== UserRole.VENDOR) {
        redirect("/auth/login");
    }

    const vendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (
        vendorProfile &&
        vendorProfile.address &&
        vendorProfile.city &&
        vendorProfile.machines
    ) {
        redirect("/vendor/dashboard");
    }

    return (
        <div className="h-full flex items-center justify-center bg-gray-100">
            <VendorOnboardingForm />
        </div>
    );
}

export default VendorOnboardingPage;
