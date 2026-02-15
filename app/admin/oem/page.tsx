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
import { approveJob, rejectJob } from "./actions";
import { Calendar, MapPin, Package } from "lucide-react";

const AdminOEMPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/auth/login");
  }

  const pendingJobs = await prisma.job.findMany({
    where: { status: "PENDING_REVIEW" },
    include: {
      oem: {
        select: {
          name: true,
          email: true,
          companyName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">OEM Job Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve job submissions from OEMs
        </p>
      </div>

      {pendingJobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No pending jobs to review
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>
                      Submitted by {job.oem.name} ({job.oem.companyName || job.oem.email})
                    </CardDescription>
                  </div>
                  <Badge variant="outline">PENDING REVIEW</Badge>
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

                <div className="flex gap-2 pt-2">
                  <form action={approveJob.bind(null, job.id)}>
                    <Button type="submit" size="sm">
                      Approve
                    </Button>
                  </form>
                  <form action={rejectJob.bind(null, job.id)}>
                    <Button type="submit" variant="destructive" size="sm">
                      Reject
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOEMPage;
