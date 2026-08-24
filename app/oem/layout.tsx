import { auth } from "@/auth";
import prisma from "@/lib/prisma";
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

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
            createdAt: true,
        },
    });

    const oemUser = {
        id: user?.id || session.user.id || "",
        name: user?.name || session.user.name || null,
        email: user?.email || session.user.email || "",
        companyName: user?.companyName || null,
        createdAt: user?.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
    };

    return (
        <OEMLayoutWrapper oemUser={oemUser}>
            {children}
        </OEMLayoutWrapper>
    );
}
