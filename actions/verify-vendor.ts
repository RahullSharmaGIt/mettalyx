"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole, VendorStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const verifyVendor = async (
  vendorId: string, 
  action: "VERIFY" | "REJECT"
) => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.ADMIN) {
    return { error: "Unauthorized" };
  }

  const status = action === "VERIFY" ? VendorStatus.VERIFIED : VendorStatus.REJECTED;

  await prisma.vendorProfile.update({
    where: { id: vendorId },
    data: {
      status,
      verifiedAt: action === "VERIFY" ? new Date() : null,
    },
  });

  revalidatePath("/admin/vendors");
  return { success: `Vendor ${status.toLowerCase()}!` };
};
