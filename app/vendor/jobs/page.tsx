import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, MapPin, Package, Info } from "lucide-react";
import { acceptJob } from "./actions";

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
            Your profile is currently under review. You will be able to view and bid on jobs once you are verified by our admin team.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Fetch OPEN jobs
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
        <div className="grid gap-4">
          {openJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>
                      Posted by {job.oem.companyName || job.oem.name}
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-600">OPEN</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.description && (
                  <p className="text-sm text-muted-foreground">
                    {job.description}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Material</p>
                      <p className="text-muted-foreground">{job.material}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Quantity</p>
                      <p className="text-muted-foreground">{job.quantity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Deadline</p>
                      <p className="text-muted-foreground">
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{job.location}</p>
                    </div>
                  </div>
                </div>

                {job.tolerance && (
                  <div className="text-sm">
                    <span className="font-medium">Tolerance: </span>
                    <span className="text-muted-foreground">{job.tolerance}</span>
                  </div>
                )}

                <form action={acceptJob.bind(null, job.id)} className="pt-2">
                  <Button type="submit" className="w-full">
                    Accept Job
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorJobsPage;
