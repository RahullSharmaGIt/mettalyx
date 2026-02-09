"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { RegisterSchema } from "@/schemas";
import { UserRole } from "@prisma/client";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, companyName, role } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      companyName,
      role: role, // Use selected role
      // If vendor, initial status is PENDING (default in db schema)
    },
  });

  // If VENDOR, create profile
  if (role === UserRole.VENDOR) {
    await prisma.vendorProfile.create({
      data: {
        userId: user.id,
        address: "", // To be filled in onboarding
        city: "",    
        machines: {},
        status: "PENDING"
      }
    })
  }

  return { success: "User created!" };
};
