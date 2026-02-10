import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";

export default async function Home() {
  const session = await auth();

  // If user is logged in, redirect to their role-based dashboard
  if (session?.user) {
    if (session.user.role === "VENDOR") {
      redirect("/vendor");
    } else if (session.user.role === "OEM") {
      redirect("/oem/dashboard");
    } else if (session.user.role === "ADMIN") {
      redirect("/admin/dashboard");
    }
  }

  // If not logged in, show register page
  return <RegisterForm />;
}
