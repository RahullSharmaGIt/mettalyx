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
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <form action={logout}>
          <Button variant="outline">Sign Out</Button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/vendors">
          <Card className="hover:bg-slate-50 cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Manage Vendors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Verify</div>
              <p className="text-xs text-muted-foreground">
                Review and approve vendor registrations
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/oem">
          <Card className="hover:bg-slate-50 cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Manage OEM Jobs
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Review</div>
              <p className="text-xs text-muted-foreground">
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
