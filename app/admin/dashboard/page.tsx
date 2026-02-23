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
    <div className="p-8 space-y-6 bg-industrial-bg min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black uppercase tracking-tight text-industrial-text">Admin Dashboard</h1>
        <form action={logout}>
          <Button variant="outline" className="border-2 border-slate-900 shadow-neo rounded-none font-bold uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100">Sign Out</Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/vendors">
          <Card className="hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#0F172A] cursor-pointer transition-all bg-emerald-50 border-2 border-slate-900 rounded-none shadow-neo">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b-2 border-slate-900 bg-emerald-300">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Manage Vendors
              </CardTitle>
              <Users className="h-5 w-5 text-slate-900" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-black text-slate-900 uppercase">Verify</div>
              <p className="text-sm font-mono text-slate-800 font-bold uppercase mt-2">
                Review and approve vendor registrations
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/oem">
          <Card className="hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#0F172A] cursor-pointer transition-all bg-amber-50 border-2 border-slate-900 rounded-none shadow-neo">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b-2 border-slate-900 bg-amber-300">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Manage OEM Jobs
              </CardTitle>
              <Briefcase className="h-5 w-5 text-slate-900" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-black text-slate-900 uppercase">Review</div>
              <p className="text-sm font-mono text-slate-800 font-bold uppercase mt-2">
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
