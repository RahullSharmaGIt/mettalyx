import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { SummaryCard } from "@/components/oem/SummaryCard";
import { OEMJobList } from "@/components/oem/oem-job-list";
import { List, Cpu, CheckCircle, Clock } from "lucide-react";
import { SidebarTriggerButton } from "@/components/oem/SidebarTriggerButton";

const OEMDashboardPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.OEM) {
    redirect("/auth/login");
  }

  // Fetch OEM user details
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, companyName: true, email: true },
  });

  const displayName = user?.companyName || user?.name || user?.email || "OEM Partner";

  // Fetch jobs including createdAt for date sorting
  const jobs = await prisma.job.findMany({
    where: { oemId: session.user.id },
    select: {
      id: true,
      description: true,
      title: true,
      material: true,
      tolerance: true,
      materialGrade: true,
      quantity: true,
      status: true,
      deadline: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalJobs = jobs.length;
  const inProgress = jobs.filter((job) =>
    ["ASSIGNED", "IN_PROGRESS", "QC"].includes(job.status)
  ).length;
  const completed = jobs.filter((job) => job.status === "COMPLETED").length;
  const pendingReview = jobs.filter((job) => job.status === "PENDING_REVIEW").length;

  // Format jobs array for the OEMJobList client component
  const formattedJobs = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    description: job.description ?? "N/A",
    material: `${job.material} ${job.materialGrade || ""}`,
    deadline: new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase(),
    tolerance: job.tolerance ?? "N/A",
    status: job.status,
    createdAt: job.createdAt.toISOString(),
  }));

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {displayName}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage your industrial manufacturing requirements and view live project telemetry.
          </p>
        </div>
        <SidebarTriggerButton />
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total"
          value={totalJobs}
          subtitle="Active Projects"
          icon={List}
        />
        <SummaryCard
          title="Active"
          value={inProgress}
          subtitle="Live Cycles"
          icon={Cpu}
        />
        <SummaryCard
          title="Done"
          value={completed}
          subtitle="Shipped Items"
          icon={CheckCircle}
        />
        <SummaryCard
          title="Queue"
          value={pendingReview}
          subtitle="Backlog Status"
          icon={Clock}
        />
      </div>

      {/* Interactive Filterable & Sortable Jobs Section */}
      <OEMJobList initialJobs={formattedJobs} />
    </div>
  );
};

export default OEMDashboardPage;
