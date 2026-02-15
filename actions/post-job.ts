"use server";

import * as z from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { JobPostingSchema } from "@/schemas";
import { redirect } from "next/navigation";

export const postJob = async (values: z.infer<typeof JobPostingSchema>) => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.OEM) {
    return { error: "Unauthorized" };
  }

  const validatedFields = JobPostingSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { title, description, material, quantity, tolerance, deadline, location } = validatedFields.data;

  await prisma.job.create({
    data: {
      title,
      description,
      material,
      quantity: parseInt(quantity, 10),
      tolerance,
      deadline: new Date(deadline),
      location,
      oem: {
        connect: {
          id: session.user.id,
        },
      },
      status: "PENDING_REVIEW",
    },
  });

  redirect("/oem/dashboard");
};
