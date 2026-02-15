// "use server";

// import * as z from "zod";
// import { signIn } from "@/auth";
// import { LoginSchema } from "@/schemas";
// import { AuthError } from "next-auth";
// import prisma from "@/lib/prisma"; // Import prisma to check role before login

// type LoginResponse = {
//   error?: string;
//   success?: string;
// };

// export const login = async (
//   values: z.infer<typeof LoginSchema>
// ): Promise<LoginResponse> => {
//   const validatedFields = LoginSchema.safeParse(values);

//   if (!validatedFields.success) {
//     return { error: "Invalid fields!" };
//   }

//   const { email, password } = validatedFields.data;

//   // 1. Check if user exists and get their role directly from DB
//   const existingUser = await prisma.user.findUnique({
//     where: { email }
//   });

//   if (!existingUser || !existingUser.email || !existingUser.password) {
//     return { error: "Email does not exist!" };
//   }
// // 2. Define dynamic redirect path based on Role
//   let redirectUrl = "/dashboard"; // Default fallback

// if (existingUser.role === "VENDOR") {
//     redirectUrl = "/vendor";
//   } else if (existingUser.role === "OEM") {
//     redirectUrl = "/oem/dashboard";
//   } else if (existingUser.role === "ADMIN") {
//     redirectUrl = "/admin/dashboard";
//   }

//   try {
//     await signIn("credentials", {
//       email,
//       password,
//       redirectTo: redirectUrl, // Force them to their specific dashboard
//     });

//     // ✅ THIS WAS MISSING
//     return { success: "Login successful!" };

//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return { error: "Invalid credentials!" };
//         default:
//           return { error: "Something went wrong!" };
//       }
//     }

//     throw error;
//   }
// };


"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import prisma from "@/lib/prisma"; // Import prisma to check role before login

export const login = async (
  values: z.infer<typeof LoginSchema>
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  // 1. Check if user exists and get their role directly from DB
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  // 2. Define dynamic redirect path based on Role
  let redirectUrl = "/dashboard"; // Default fallback
  
  if (existingUser.role === "VENDOR") {
    redirectUrl = "/vendor/dashboard";
  } else if (existingUser.role === "OEM") {
    redirectUrl = "/oem/dashboard";
  } else if (existingUser.role === "ADMIN") {
    redirectUrl = "/admin/dashboard";
  }

  try {
    // 3. Sign In with implicit Redirect (redirect: true is default)
    await signIn("credentials", {
      email,
      password,
      redirectTo: redirectUrl, // Force them to their specific dashboard
    });
    
    // Note: Code unreachable here because signIn throws a Redirect error on success
  } catch (error) {
    // 4. Handle NextAuth Errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    // 5. CRITICAL: Re-throw the redirect error so Next.js can navigate
    throw error; 
  }
};