import { auth} from "@/auth";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/dashboard/actions";

const DashboardPage = async () => {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-10">
        <h1 className="text-2xl font-bold">Default Dashboard</h1>
        <div className="p-4 border rounded-md shadow-sm bg-white">
            <p><strong>User:</strong> {session?.user?.name}</p>
            <p><strong>Email:</strong> {session?.user?.email}</p>
            <p><strong>Role:</strong> {session?.user?.role}</p>
        </div>
        
        <form action={logout}>
        <Button type="submit" variant="destructive">
          Sign Out
        </Button>
      </form>
    </div>
  );
}

export default DashboardPage;
