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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Clock, CheckCircle, FileText, ChevronRight, ShieldCheck } from "lucide-react";

const OEMDashboardPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.OEM) {
    redirect("/auth/login");
  }

  // Fetch jobs — deliberately exclude vendor relation to enforce anonymity
  const jobs = await prisma.job.findMany({
    where: { oemId: session.user.id },
    select: {
      id: true,
      title: true,
      material: true,
      materialGrade: true,
      quantity: true,
      status: true,
      deadline: true,
      vendorId: true, // Only the ID — never vendor name/contact
    },
    orderBy: { createdAt: "desc" },
  });

  const totalJobs = jobs.length;
  const inProgress = jobs.filter((job) =>
    ["ASSIGNED", "IN_PROGRESS", "QC"].includes(job.status)
  ).length;
  const completed = jobs.filter((job) => job.status === "COMPLETED").length;
  const pendingReview = jobs.filter((job) => job.status === "PENDING_REVIEW").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW": return "bg-amber-500";
      case "OPEN": return "bg-emerald-500";
      case "ASSIGNED": return "bg-blue-500";
      case "IN_PROGRESS": return "bg-purple-500";
      case "QC": return "bg-indigo-500";
      case "COMPLETED": return "bg-green-600";
      case "PAID": return "bg-teal-600";
      case "CANCELLED": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="p-8 space-y-6 bg-industrial-bg min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-industrial-text">OEM Dashboard</h1>
          <p className="font-mono text-slate-600 font-bold uppercase mt-2">
            Manage and track your manufacturing jobs
          </p>
        </div>
        <Link href="/oem/post-job">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#0F172A] cursor-pointer transition-all bg-indigo-50 border-2 border-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b-2 border-slate-900 bg-indigo-200">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">Total Jobs</CardTitle>
            <Briefcase className="h-5 w-5 text-slate-900" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-black text-slate-900">{totalJobs}</div>
            <p className="text-sm font-mono text-slate-700 font-bold uppercase mt-2">All jobs you&apos;ve posted</p>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#0F172A] cursor-pointer transition-all bg-orange-50 border-2 border-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b-2 border-slate-900 bg-industrial-orange">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">In Progress</CardTitle>
            <Clock className="h-5 w-5 text-slate-900" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-black text-slate-900">{inProgress}</div>
            <p className="text-sm font-mono text-slate-900 font-bold uppercase mt-2">Currently being worked on</p>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#0F172A] cursor-pointer transition-all bg-emerald-50 border-2 border-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b-2 border-slate-900 bg-emerald-400">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">Completed</CardTitle>
            <CheckCircle className="h-5 w-5 text-slate-900" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-black text-slate-900">{completed}</div>
            <p className="text-sm font-mono text-slate-700 font-bold uppercase mt-2">Successfully finished</p>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#0F172A] cursor-pointer transition-all bg-amber-50 border-2 border-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b-2 border-slate-900 bg-amber-400">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">Pending Review</CardTitle>
            <FileText className="h-5 w-5 text-slate-900" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-black text-slate-900">{pendingReview}</div>
            <p className="text-sm font-mono text-slate-700 font-bold uppercase mt-2">Awaiting admin approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card className="hover:shadow-[8px_8px_0px_#0F172A] transition-all bg-white border-2 border-slate-900">
        <CardHeader className="bg-slate-50 border-b-2 border-slate-900 p-6">
          <CardTitle className="text-2xl font-black uppercase text-slate-900">Your Jobs</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-mono text-slate-600 font-bold uppercase mb-6">
                You haven&apos;t posted any jobs yet.
              </p>
              <Link href="/oem/post-job">
                <Button className="h-12 px-8 uppercase tracking-widest bg-cyan-500 hover:bg-cyan-400 border-2 border-slate-900 shadow-neo text-slate-900">
                  <Plus className="h-5 w-5 mr-2" />
                  Post Your First Job
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id} className="hover:bg-slate-50 cursor-pointer group">
                    <TableCell className="font-bold text-slate-900 text-base py-4">{job.title}</TableCell>
                    <TableCell className="font-mono text-slate-700 py-4">
                      {job.material}{job.materialGrade ? ` (${job.materialGrade})` : ""}
                    </TableCell>
                    <TableCell className="font-mono font-black py-4">{job.quantity}</TableCell>
                    <TableCell className="py-4">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(job.deadline).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {/* ANONYMITY: Never show vendor name — only indicate assignment */}
                      {job.vendorId ? (
                        <span className="flex items-center gap-1.5 text-sm font-medium text-blue-700">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Manufacturing Partner Assigned
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Awaiting Assignment</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/oem/jobs/${job.id}`}>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OEMDashboardPage;
