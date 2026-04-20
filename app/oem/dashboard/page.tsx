import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/oem/DashboardHeader";
import { SummaryCard } from "@/components/oem/SummaryCard";
import { JobCard } from "@/components/oem/JobCard";
import { BottomNav } from "@/components/oem/BottomNav";
import { List, Cpu, CheckCircle, Clock } from "lucide-react";

const OEMDashboardPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.OEM) {
    redirect("/auth/login");
  }

  // Fetch jobs
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
    },
    orderBy: { createdAt: "desc" },
  });

  const totalJobs = jobs.length;
  const inProgress = jobs.filter((job) =>
    ["ASSIGNED", "IN_PROGRESS", "QC"].includes(job.status)
  ).length;
  const completed = jobs.filter((job) => job.status === "COMPLETED").length;
  const pendingReview = jobs.filter((job) => job.status === "PENDING_REVIEW").length;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-24 md:pb-8">
      <DashboardHeader />

      <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Summary Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            bgColor="bg-[#f97316]"
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

        {/* Jobs Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b-4 border-slate-900 pb-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
              Your Jobs
            </h2>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">
              Sort: Recent
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
            {jobs.length === 0 ? (
              <div className="col-span-full py-20 text-center border-4 border-dashed border-slate-300 rounded-2xl">
                <p className="font-black uppercase text-slate-400 tracking-widest">
                  No jobs found in your history
                </p>
              </div>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  description={job.description ?? "N/A"}
                  material={`${job.material} ${job.materialGrade || ""}`}
                  deadline={new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}
                  tolerance={job.tolerance ?? "N/A"} // Placeholder as cost isn't in selection
                  status={job.status}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default OEMDashboardPage;

