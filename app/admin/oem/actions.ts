"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const approveJob = async (jobId: string) => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.ADMIN) {
    throw new Error("Unauthorized");
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "OPEN" },
  });

  revalidatePath("/admin/oem");
};

export const rejectJob = async (jobId: string) => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.ADMIN) {
    throw new Error("Unauthorized");
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/admin/oem");
};
