import * as z from "zod";
import { UserRole } from "@prisma/client";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  // Only allow OEM or VENDOR for registration
  role: z.enum([UserRole.OEM, UserRole.VENDOR]),
  companyName: z.string().optional(),
});

export const VendorOnboardingSchema = z.object({
  workshopName: z.string().min(1, { message: "Workshop Name is required" }),
  machines: z.string().min(1, { message: "List your machines" }), // Simple text for MVP
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
});
