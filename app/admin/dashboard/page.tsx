import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Briefcase } from "lucide-react";
import { logout } from "./actions";

const AdminDashboardPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/auth/login");
  }

  return (
    <div className="p-8 space-y-6 bg-slate-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Platform Management & Verification</p>
        </div>
        <form action={logout}>
          <Button variant="outline" className="border border-slate-200 rounded-xl font-medium text-xs text-slate-700 bg-white hover:bg-slate-100 shadow-sm px-4 py-2">Sign Out</Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/vendors">
          <Card className="hover:shadow-md cursor-pointer transition-all bg-white border border-slate-200 rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Manage Vendors
              </CardTitle>
              <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent className="pt-5">
              <div className="text-3xl font-bold text-slate-900">Verify</div>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Review and approve vendor registrations
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/oem">
          <Card className="hover:shadow-md cursor-pointer transition-all bg-white border border-slate-200 rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Manage OEM Jobs
              </CardTitle>
              <Briefcase className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent className="pt-5">
              <div className="text-3xl font-bold text-slate-900">Review</div>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Approve or reject job submissions
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
