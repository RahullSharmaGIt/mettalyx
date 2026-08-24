"use client";

import { useState } from "react";
import { JobCard } from "@/components/oem/JobCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, ArrowUpDown } from "lucide-react";

export interface JobData {
  id: string;
  title: string;
  description: string;
  material: string;
  tolerance: string;
  deadline: string;
  status: string;
  createdAt: string; // ISO string
}

interface OEMJobListProps {
  initialJobs: JobData[];
}

export function OEMJobList({ initialJobs }: OEMJobListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<string>("desc"); // "desc" = newest first, "asc" = oldest first

  // 1. Filter jobs based on selected status filter
  const filteredJobs = initialJobs.filter((job) => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "ASSIGNED") {
      return ["ASSIGNED", "IN_PROGRESS", "QC"].includes(job.status);
    }
    if (statusFilter === "PENDING") {
      return ["PENDING_REVIEW", "OPEN"].includes(job.status);
    }
    if (statusFilter === "CANCELLED") {
      return job.status === "CANCELLED";
    }
    return true;
  });

  // 2. Sort jobs by date (createdAt timestamp)
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Your Jobs
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Showing {sortedJobs.length} of {initialJobs.length} jobs
          </p>
        </div>

        {/* Filter and Sort Select Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 min-w-[130px] rounded-xl text-xs font-medium bg-white border-slate-200 text-slate-700 shadow-xs">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent position="popper" className="rounded-xl border-slate-200 text-xs">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Sort */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-9 min-w-[140px] rounded-xl text-xs font-medium bg-white border-slate-200 text-slate-700 shadow-xs">
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent position="popper" className="rounded-xl border-slate-200 text-xs">
                <SelectItem value="desc">Date: Newest First</SelectItem>
                <SelectItem value="asc">Date: Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Jobs List Grid */}
      <div className="grid grid-cols-1 gap-6">
        {sortedJobs.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="text-sm font-medium text-slate-500">
              No jobs found matching the selected filter.
            </p>
          </div>
        ) : (
          sortedJobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              description={job.description}
              material={job.material}
              deadline={job.deadline}
              tolerance={job.tolerance}
              status={job.status}
            />
          ))
        )}
      </div>
    </div>
  );
}
