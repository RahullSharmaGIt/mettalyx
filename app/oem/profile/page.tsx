import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  User,
  Building2,
  Mail,
  Calendar,
  Shield,
  Briefcase,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const OEMProfilePage = async () => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.OEM) {
    redirect("/auth/login");
  }

  // Fetch full logged in OEM details and statistics
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      companyName: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch OEM stats
  const jobStats = await prisma.job.groupBy({
    by: ["status"],
    where: { oemId: user.id },
    _count: true,
  });

  const totalJobsCount = jobStats.reduce((acc, curr) => acc + curr._count, 0);
  const activeJobsCount = jobStats
    .filter((stat) => ["ASSIGNED", "IN_PROGRESS", "QC"].includes(stat.status))
    .reduce((acc, curr) => acc + curr._count, 0);
  const completedJobsCount = jobStats
    .filter((stat) => stat.status === "COMPLETED")
    .reduce((acc, curr) => acc + curr._count, 0);

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const displayName = user.companyName || user.name || "OEM Partner";

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold border border-slate-800 shrink-0 shadow-sm">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {displayName}
              </h1>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                <Shield className="h-3 w-3 mr-1" /> Verified OEM
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              {user.email}
            </p>
            <p className="text-xs text-slate-400 font-normal">
              Member since {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href="/oem/post-job" className="w-full md:w-auto">
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium h-10 px-5">
              Post Requirement
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - User Credentials & Account Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Account Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <User className="h-4 w-4 text-slate-700" /> Account Overview
              </h2>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">ReadOnly View</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> Company Name
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {user.companyName || "Not set"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Primary Contact Name
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {user.name || "Not set"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {user.email}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" /> Account Role
                </span>
                <div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-800 text-xs font-semibold rounded-md">
                    {user.role}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Account Creation Timestamp
                </span>
                <p className="text-sm font-mono text-slate-700">
                  {new Date(user.createdAt).toISOString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Activity Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
              <Briefcase className="h-4 w-4 text-slate-700" /> Platform Engagement
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-medium text-slate-700">Total Jobs Posted</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{totalJobsCount}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-medium text-slate-700">Active Cycles</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{activeJobsCount}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">Completed Orders</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{completedJobsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OEMProfilePage;
