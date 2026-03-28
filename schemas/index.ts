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
  companyName: z.string().min(1, { message: "Company Name is required" }),
  contactPhone: z.string().min(10, { message: "Contact phone must be at least 10 digits" }),
  contactEmail: z.string().email({ message: "Valid contact email is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  gstNumber: z.string().optional(),
  capabilities: z.array(z.string()).min(1, { message: "Select at least one capability" }),
  expertiseLevel: z.string().optional(),
  tolerancesSupported: z.string().optional(),
  maxPartSize: z.string().optional(),
  minPartSize: z.string().optional(),
  certifications: z.array(z.object({
    name: z.string(),
    certificateUrl: z.string(),
    issuedBy: z.string().optional(),
    issuedDate: z.coerce.date().optional()
  })).optional(),
  yearsOfExperience: z.number().positive({ message: "Years of experience must be greater than 0" }),
  industriesServed: z.array(z.string()).optional(),
  pastWorkDescription: z.string().optional(),
  sampleWorkFiles: z.array(z.string()).optional(),
  isoCertificates: z.array(z.string()).optional(),
  qualityDocuments: z.array(z.string()).optional(),
  complianceProofs: z.array(z.string()).optional(),
  isAgreementAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the legal agreement"
  })
});
export const JobPostingSchema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  description: z.string().optional(),
  material: z.string().min(1, { message: "Material is required" }),
  materialGrade: z.string().optional(),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  tolerance: z.string().optional(),
  surfaceFinish: z.string().optional(),
  deadline: z.string().min(1, { message: "Deadline is required" }),
  location: z.string().min(1, { message: "Location is required" }),
});

