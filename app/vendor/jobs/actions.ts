"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const acceptJob = async (jobId: string) => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.VENDOR) {
    throw new Error("Unauthorized");
  }

  // Verify vendor is VERIFIED
  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendorProfile || vendorProfile.status !== "VERIFIED") {
    throw new Error("Only verified vendors can accept jobs");
  }

  // Update job status and assign vendor
  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "ASSIGNED",
      vendorId: session.user.id, // Assign the User ID, not VendorProfile ID
    },
  });

  revalidatePath("/vendor/jobs");
  revalidatePath("/vendor/dashboard");
};
