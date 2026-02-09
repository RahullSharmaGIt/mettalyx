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
import { verifyVendor } from "@/actions/verify-vendor";

const AdminVendorsPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/auth/login");
  }

  const pendingVendors = await prisma.vendorProfile.findMany({
    where: { status: "PENDING" },
    include: { user: true },
  });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Vendor Verification</h1>
      
      {pendingVendors.length === 0 ? (
        <p className="text-muted-foreground">No pending verifications.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingVendors.map((vendor) => (
                <Card key={vendor.id}>
                    <CardHeader>
                        <CardTitle>{vendor.user.companyName || vendor.user.name}</CardTitle>
                        <CardDescription>{vendor.user.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div>
                            <span className="font-semibold">Workshop: </span>
                            {/* In onboarding we saved workshopName to user.companyName, 
                                but just in case check vendor table if we added fields there 
                                or used machines description */}
                        </div>
                        <div>
                            <span className="font-semibold">City: </span>
                            {vendor.city}
                        </div>
                        <div>
                            <span className="font-semibold">Address: </span>
                            {vendor.address}
                        </div>
                        <div>
                            <span className="font-semibold">Machines: </span>
                            <pre className="mt-1 p-2 bg-slate-100 rounded text-xs overflow-x-auto">
                                {JSON.stringify(vendor.machines, null, 2)}
                            </pre>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                         <form action={async () => {
                            "use server";
                            await verifyVendor(vendor.id, "REJECT");
                         }}>
                            <Button variant="destructive" size="sm">Reject</Button>
                         </form>
                         <form action={async () => {
                            "use server";
                            await verifyVendor(vendor.id, "VERIFY");
                         }}>
                            <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
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
