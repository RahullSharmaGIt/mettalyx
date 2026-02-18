import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { JobList } from "@/components/vendor/job-list";

const VendorJobsPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.VENDOR) {
    redirect("/auth/login");
  }

  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendorProfile) {
    redirect("/vendor/onboarding");
  }

  // Only show jobs if vendor is VERIFIED
  if (vendorProfile.status !== "VERIFIED") {
    return (
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold">Available Jobs</h1>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription>
            Your profile is currently under review. You will be able to view and
            bid on jobs once you are verified by our admin team.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Fetch OPEN jobs with lat/lng for distance calculation
  const openJobs = await prisma.job.findMany({
    where: { status: "OPEN" },
    include: {
      oem: {
        select: {
          name: true,
          companyName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Available Jobs</h1>
        <p className="text-muted-foreground">
          Browse and apply for manufacturing jobs
        </p>
      </div>

      {openJobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No jobs available at the moment. Check back later!
            </p>
          </CardContent>
        </Card>
      ) : (
        <JobList
          jobs={openJobs}
          vendorLat={vendorProfile.lat}
          vendorLng={vendorProfile.lng}
        />
      )}
    </div>
  );
};

export default VendorJobsPage;
