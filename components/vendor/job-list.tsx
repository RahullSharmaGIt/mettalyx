"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Package, ArrowUpDown } from "lucide-react";
import { calculateDistance } from "@/lib/distance";
import { acceptJob } from "@/app/vendor/jobs/actions";

type SortOption = "nearest" | "farthest" | "high-precision" | "low-precision";

interface Job {
  id: string;
  title: string;
  description: string | null;
  material: string;
  quantity: number;
  tolerance: string | null;
  deadline: Date;
  location: string;
  lat: number | null;
  lng: number | null;
  oem: {
    name: string | null;
    companyName: string | null;
  };
}

interface JobListProps {
  jobs: Job[];
  vendorLat: number | null;
  vendorLng: number | null;
}

const SORT_LABELS: Record<SortOption, string> = {
  nearest: "Nearest First",
  farthest: "Farthest First",
  "high-precision": "High Precision (Tight Tolerance)",
  "low-precision": "Low Precision (Loose Tolerance)",
};

export const JobList = ({ jobs, vendorLat, vendorLng }: JobListProps) => {
  const [sortBy, setSortBy] = useState<SortOption>("nearest");

  // Pre-compute distances once
  const jobsWithDistance = useMemo(
    () =>
      jobs.map((job) => {
        const dist = calculateDistance(vendorLat, vendorLng, job.lat, job.lng);
        return { ...job, distance: dist ?? Infinity };
      }),
    [jobs, vendorLat, vendorLng]
  );

  // Sort based on selected option
  const sortedJobs = useMemo(() => {
    return [...jobsWithDistance].sort((a, b) => {
      switch (sortBy) {
        case "nearest":
          return a.distance - b.distance;
        case "farthest":
          return b.distance - a.distance;
        case "high-precision": {
          // Smaller tolerance number = tighter = higher precision
          const ta = a.tolerance ? parseFloat(a.tolerance) : Infinity;
          const tb = b.tolerance ? parseFloat(b.tolerance) : Infinity;
          return ta - tb;
        }
        case "low-precision": {
          const ta = a.tolerance ? parseFloat(a.tolerance) : -Infinity;
          const tb = b.tolerance ? parseFloat(b.tolerance) : -Infinity;
          return tb - ta;
        }
        default:
          return 0;
      }
    });
  }, [jobsWithDistance, sortBy]);

  return (
    <div className="space-y-4">
      {/* Sort Dropdown */}
      <div className="flex items-center gap-3">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <label htmlFor="sort-select" className="text-sm font-medium">
          Sort By:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="text-sm border border-input bg-background rounded-md px-3 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      {/* Job Cards */}
      <div className="grid gap-4">
        {sortedJobs.map((job) => {
          const isLocationKnown = job.distance !== Infinity;
          const distanceLabel = isLocationKnown
            ? `${job.distance.toFixed(1)} km away`
            : "Location N/A";

          return (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>
                      Posted by {job.oem.companyName || job.oem.name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Distance Badge */}
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 text-xs ${
                        isLocationKnown
                          ? "border-blue-300 text-blue-700"
                          : "border-gray-300 text-gray-400"
                      }`}
                    >
                      <MapPin className="h-3 w-3" />
                      {distanceLabel}
                    </Badge>
                    <Badge className="bg-emerald-600">OPEN</Badge>
                  </div>
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
                    <span className="text-muted-foreground">
                      {job.tolerance}
                    </span>
                  </div>
                )}

                <form action={acceptJob.bind(null, job.id)} className="pt-2">
                  <Button type="submit" className="w-full">
                    Accept Job
                  </Button>
                </form>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
