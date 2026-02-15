import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle, Briefcase, ClipboardList } from "lucide-react";

const VendorDashboardPage = async () => {
    const session = await auth();

    if (!session || session.user.role !== UserRole.VENDOR) {
        redirect("/auth/login");
    }

    const vendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (
    !vendorProfile ||
    !vendorProfile.address ||
    !vendorProfile.city ||
    !vendorProfile.machines
    ) {
    redirect("/vendor/onboarding");
    }

    return ( 
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Verification Status
                        </CardTitle>
                        {vendorProfile.status === "VERIFIED" ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        ) : (
                            <Info className="h-4 w-4 text-amber-500" />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {vendorProfile.status}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Current account standing
                        </p>
                    </CardContent>
                </Card>

                {vendorProfile.status === "VERIFIED" && (
                    <>
                        <Link href="/vendor/jobs">
                            <Card className="hover:bg-slate-50 cursor-pointer transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Browse Jobs
                                    </CardTitle>
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">View</div>
                                    <p className="text-xs text-muted-foreground">
                                        See available manufacturing jobs
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/vendor/my-jobs">
                            <Card className="hover:bg-slate-50 cursor-pointer transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        My Jobs
                                    </CardTitle>
                                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Track</div>
                                    <p className="text-xs text-muted-foreground">
                                        View jobs you've accepted
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </>
                )}
            </div>

            {vendorProfile.status === "PENDING" && (
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Pending Verification</AlertTitle>
                    <AlertDescription>
                        Your profile is currently under review by our admin team. 
                        You will be notified once you are verified and can start accepting jobs.
                    </AlertDescription>
                </Alert>
            )}

            {vendorProfile.status === "VERIFIED" && (
                <Alert className="border-emerald-500 text-emerald-600 bg-emerald-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Verified & Ready</AlertTitle>
                    <AlertDescription>
                        You are fully verified! Browse available jobs and start bidding.
                    </AlertDescription>
                </Alert>
            )}
        </div>
     );
}
 
export default VendorDashboardPage;
