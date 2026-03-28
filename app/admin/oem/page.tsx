import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { rejectJob, unlockBid } from "./actions";
import { JobApprovalDialog } from "@/components/admin/job-approval-dialog";
import { Calendar, MapPin, Package, ChevronRight, Unlock, Factory } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING_REVIEW: "bg-amber-500",
  OPEN: "bg-emerald-500",
  ASSIGNED: "bg-blue-500",
  IN_PROGRESS: "bg-purple-500",
  QC: "bg-indigo-500",
  COMPLETED: "bg-green-600",
  PAID: "bg-teal-600",
  CANCELLED: "bg-gray-500",
};

const AdminOEMPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/auth/login");
  }

  // Show ALL jobs (not just PENDING_REVIEW) so admin can click through to detail
  const allJobs = await prisma.job.findMany({
    include: {
      oem: { select: { name: true, email: true, companyName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const pendingJobs = allJobs.filter((j) => j.status === "PENDING_REVIEW");
  const otherJobs = allJobs.filter((j) => j.status !== "PENDING_REVIEW");

  const unlockRequests = await prisma.bid.findMany({
    where: { unlockRequested: true },
    include: {
      job: { select: { title: true, status: true, oemId: true } },
      vendor: { select: { name: true, companyName: true, email: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Job Management</h1>
        <p className="text-muted-foreground">Review, approve, and manage all OEM jobs</p>
      </div>

      {/* Bid Unlock Requests Section */}
      {unlockRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900">
            Inbox: Bid Unlock Requests
            <Badge className="bg-indigo-600">{unlockRequests.length}</Badge>
          </h2>
          <div className="grid gap-4">
            {unlockRequests.map((bid) => (
              <Card key={bid.id} className="border-indigo-200 bg-indigo-50/50">
                <CardHeader className="py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {bid.vendor.companyName} ({bid.vendor.name})
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                        <Factory className="h-3 w-3" /> Job: {bid.job.title}
                      </p>
                    </div>
                    <form action={unlockBid.bind(null, bid.id)}>
                      <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 max-h-8">
                        <Unlock className="h-4 w-4 mr-2" />
                        Approve Unlock
                      </Button>
                    </form>
                  </div>
                </CardHeader>
                <CardContent className="py-0 pb-4">
                  <p className="text-sm text-slate-700 bg-white p-3 rounded border border-indigo-100">
                    <span className="font-semibold block mb-1">Vendor's Current Bid:</span>
                    Price: ₹{bid.proposedPrice.toLocaleString()} • Lead Time: {bid.proposedLeadTime} Days <br />
                    {bid.notes && <span className="text-slate-500 italic mt-1 block">"{bid.notes}"</span>}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Review Section */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          Pending Approval
          {pendingJobs.length > 0 && (
            <Badge className="bg-amber-500">{pendingJobs.length}</Badge>
          )}
        </h2>

        {pendingJobs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No jobs pending review</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingJobs.map((job) => (
              <Card key={job.id} className="border-amber-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{job.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Submitted by {job.oem.name} ({job.oem.companyName || job.oem.email})
                      </p>
                    </div>
                    <Badge variant="outline">PENDING REVIEW</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.description && (
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Material</p>
                        <p className="text-muted-foreground">
                          {job.material}{job.materialGrade ? ` · ${job.materialGrade}` : ""}
                        </p>
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
                        <p className="text-muted-foreground">{new Date(job.deadline).toLocaleDateString()}</p>
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
                  {job.surfaceFinish && (
                    <p className="text-sm"><span className="font-medium">Surface Finish: </span>{job.surfaceFinish}</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <JobApprovalDialog jobId={job.id} />
                    <form action={rejectJob.bind(null, job.id)}>
                      <Button type="submit" variant="destructive" size="sm">Reject</Button>
                    </form>
                    <Link href={`/admin/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">
                        View Detail <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* All Other Jobs */}
      {otherJobs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">All Jobs</h2>
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-base font-bold uppercase">Job Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {otherJobs.map((job) => (
                  <div key={job.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{job.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {job.material}{job.materialGrade ? ` · ${job.materialGrade}` : ""} · {job.quantity} units · {job.location}
                      </p>
                    </div>
                    <Badge className={STATUS_COLORS[job.status] ?? "bg-gray-400"}>
                      {job.status.replace(/_/g, " ")}
                    </Badge>
                    <Link href={`/admin/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminOEMPage;
