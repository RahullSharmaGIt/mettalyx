import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { IndustrialLayoutWrapper } from "@/components/vendor/industrial-layout-wrapper";

export default async function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || session.user.role !== UserRole.VENDOR) {
        redirect("/auth/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { companyName: true, name: true }
    });

    const vendorName = user?.companyName || user?.name || "Vendor";

    return (
        <IndustrialLayoutWrapper vendorName={vendorName}>
            {children}
        </IndustrialLayoutWrapper>
    );
}
