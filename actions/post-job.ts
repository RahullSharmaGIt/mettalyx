"use server";

import * as z from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { JobPostingSchema } from "@/schemas";
import { redirect } from "next/navigation";
import { getCoordinates } from "@/lib/geocoding";

export const postJob = async (
  values: z.infer<typeof JobPostingSchema>,
  fileIds: string[] = []
) => {
  const session = await auth();

  if (!session || session.user.role !== UserRole.OEM) {
    return { error: "Unauthorized" };
  }

  const validatedFields = JobPostingSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    title,
    description,
    material,
    materialGrade,
    quantity,
    tolerance,
    surfaceFinish,
    deadline,
    location,
  } = validatedFields.data;

  // Silently geocode — never blocks job creation
  const coords = await getCoordinates(location);

  const job = await prisma.job.create({
    data: {
      title,
      description,
      material,
      materialGrade,
      quantity: parseInt(quantity, 10),
      tolerance,
      surfaceFinish,
      deadline: new Date(deadline),
      location,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      oem: { connect: { id: session.user.id } },
      status: "PENDING_REVIEW",
    },
  });

  // Link any pre-uploaded files to the new job.
  // Files were uploaded to S3 during form fill and are confirmed rows in DB.
  // We only link files that were actually uploaded by this OEM (security check).
  if (fileIds.length > 0) {
    await prisma.jobFile.updateMany({
      where: {
        id: { in: fileIds },
        uploadedBy: session.user.id as string, // Prevent cross-OEM linkage
        jobId: { equals: null },               // Only orphan (unlinked) files
      },
      data: { jobId: job.id },
    });
  }

  redirect("/oem/dashboard");
};
