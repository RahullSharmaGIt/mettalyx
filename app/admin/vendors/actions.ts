"use server";

import { verifyVendor } from "@/actions/verify-vendor";
import { revalidatePath } from "next/cache";

export async function rejectVendor(vendorId: string) {
  await verifyVendor(vendorId, "REJECT");
  revalidatePath("/admin/vendors");
}

export async function approveVendor(vendorId: string) {
  await verifyVendor(vendorId, "VERIFY");
  revalidatePath("/admin/vendors");
}
