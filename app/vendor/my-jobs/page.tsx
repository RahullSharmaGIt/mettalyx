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
import { Calendar, MapPin, Package } from "lucide-react";

const VendorMyJobsPage = async () => {
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

  // Fetch jobs assigned to this vendor (using User.id, not VendorProfile.id)
  const assignedJobs = await prisma.job.findMany({
    where: { vendorId: session.user.id },
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
    <div className="p-8 space-y-6 bg-industrial-bg min-h-screen">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight text-industrial-text">My Jobs</h1>
        <p className="font-mono text-slate-600 font-bold uppercase mt-2">
          Jobs you have accepted and are working on
        </p>
      </div>

      {assignedJobs.length === 0 ? (
        <Card className="hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#0F172A] transition-all bg-white">
          <CardContent className="pt-6">
            <p className="text-center font-mono text-slate-600 font-bold uppercase">
              You haven't accepted any jobs yet. Browse available jobs to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {assignedJobs.map((job) => (
            <Card key={job.id} className="hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#0F172A] transition-all bg-white">
              <CardHeader className="bg-slate-50 border-b-2 border-slate-900">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black uppercase text-slate-900">{job.title}</CardTitle>
                    <CardDescription className="font-mono text-slate-600 font-bold uppercase">
                      Client: {job.oem.companyName || job.oem.name}
                    </CardDescription>
                  </div>
                  <Badge variant={job.status === "COMPLETED" ? "default" : "secondary"}>
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {job.description && (
                  <p className="text-sm text-slate-700 font-medium">
                    {job.description}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono border-y-2 border-slate-900 py-4 bg-slate-50">
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-slate-500 uppercase text-xs flex items-center gap-1"><Package className="h-3 w-3" /> Material</p>
                    <p className="font-black text-slate-900">{job.material}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-slate-500 uppercase text-xs flex items-center gap-1"><Package className="h-3 w-3" /> Quantity</p>
                    <p className="font-black text-slate-900">{job.quantity}</p>
                  </div>
                
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-slate-500 uppercase text-xs flex items-center gap-1"><Calendar className="h-3 w-3" /> Deadline</p>
                    <p className="font-black text-slate-900">
                      {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-slate-500 uppercase text-xs flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</p>
                    <p className="font-black text-slate-900 truncate" title={job.location}>{job.location}</p>
                  </div>
                </div>

                {job.tolerance && (
                  <div className="text-sm border-2 border-cyan-500 bg-cyan-50 text-cyan-900 px-3 py-2 font-mono flex items-center gap-2 w-fit">
                    <span className="font-bold uppercase text-xs">Tolerance: </span>
                    <span className="font-black">{job.tolerance}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorMyJobsPage;
