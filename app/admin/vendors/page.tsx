import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { rejectVendor, approveVendor } from "./actions";

const AdminVendorsPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/auth/login");
  }

  const pendingVendors = await prisma.vendorProfile.findMany({
    where: { status: "PENDING" },
    include: { user: true, capabilities: true },
  });

  return (
    <div className="p-8 space-y-6 bg-slate-50/50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vendor Verification</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Review and verify vendor onboarding registrations</p>
      </div>

      {pendingVendors.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
          <p className="text-sm font-medium text-slate-500">No pending verifications.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendingVendors.map((vendor) => (
            <Card key={vendor.id} className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <CardTitle className="text-base font-bold text-slate-900">{vendor.user.companyName || vendor.user.name}</CardTitle>
                <CardDescription className="text-xs text-slate-500">{vendor.user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs pt-4 text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">City: </span>
                  {vendor.city}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Capabilities: </span>
                  <span className="font-mono text-slate-700">
                    {(vendor.capabilities?.capabilities as string[] | null)?.join(", ") || "None"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Address: </span>
                  {vendor.address}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-100 pt-4 bg-slate-50/30">
                <form action={rejectVendor.bind(null, vendor.id)}>
                  <Button variant="outline" size="sm" className="border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs">Reject</Button>
                </form>
                <form action={approveVendor.bind(null, vendor.id)}>
                  <Button variant="default" size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium">
                    Verify Vendor
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVendorsPage;
