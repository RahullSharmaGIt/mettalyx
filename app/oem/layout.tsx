import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { OEMLayoutWrapper } from "@/components/oem/OEMLayoutWrapper";

export default async function OEMLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || session.user.role !== UserRole.OEM) {
        redirect("/auth/login");
    }

    return (
        <OEMLayoutWrapper>
            {children}
        </OEMLayoutWrapper>
    );
}
