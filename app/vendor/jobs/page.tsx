import { redirect } from "next/navigation";
import { getOpenJobsForBidding } from "@/actions/vendor-bids";
import { JobBidCard } from "@/components/vendor/job-bid-card";
import { Hammer } from "lucide-react";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const metadata = {
  title: "Open RFQs | Vendor",
};

export default async function VendorJobsPage() {
  const session = await auth();
  if (!session || session.user.role !== "VENDOR") {
    redirect("/auth/login");
  }

  // Verify status
  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id as string },
    select: { status: true },
  });

  if (vendorProfile?.status !== "VERIFIED") {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center mt-20">
        <Hammer className="h-16 w-16 mx-auto text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Not Verified</h1>
        <p className="text-slate-500">
          Your vendor profile is currently under review or inactive. You cannot view the RFQ marketplace until an admin verifies your account.
        </p>
      </div>
    );
  }

  const jobs = await getOpenJobsForBidding();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">RFQ Marketplace</h1>
        <p className="text-slate-500 mt-2">
          Discover open manufacturing jobs and submit competitive bids.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-16 text-center">
          <Hammer className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Open Jobs</h3>
          <p className="text-slate-500 mt-1">There are currently no active RFQs matching your profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobBidCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
