import { auth } from "@/auth";
import { VendorOnboardingForm } from "@/components/vendor/onboarding-form";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

const VendorOnboardingPage = async () => {
    const session = await auth();
    

    if (!session || session.user.role !== UserRole.VENDOR) {
        redirect("/auth/login");
    } 

    return ( 
        <div className="h-full flex items-center justify-center bg-gray-100">
            <VendorOnboardingForm />
        </div>
     );
}
 
export default VendorOnboardingPage;
