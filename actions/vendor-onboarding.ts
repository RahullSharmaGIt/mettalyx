"use server";

import * as z from "zod";
import { VendorOnboardingSchema } from "@/schemas";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const vendorOnboarding = async (values: z.infer<typeof VendorOnboardingSchema>) => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.VENDOR) {
    return { error: "Unauthorized" };
  }

  const validatedFields = VendorOnboardingSchema.safeParse(values);

  if (!validatedFields.success) { 
    return { error: "Invalid fields!" };
  }

  const { workshopName, machines, address, city } = validatedFields.data;

  // Update User (companyName) and VendorProfile
if (!session?.user?.id) {
  throw new Error("User not authenticated");
}

const userId = session.user.id;

await prisma.$transaction([
  prisma.user.update({
    where: { id: userId },
    data: { companyName: workshopName },
  }),
  prisma.vendorProfile.upsert({
    where: { userId },
    create: {
      userId,
      machines: { list: machines },
      address,
      city,
      isOnboarded: true,
      status: "PENDING",
    },
    update: {
      machines: { list: machines },
      address,
      city,
      isOnboarded: true,
    },
  }),
]);


  return { success: "Profile updated!" };
};
