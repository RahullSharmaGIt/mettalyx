import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/schemas"
import { UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

// We can't use Prisma Client in middleware (Edge), 
// so this config is shared but Credentials provider logic 
// that uses Prisma generally lives in auth.ts or is okay 
// if defined here but the database call happens in authorized() 
// or if we use a specific strategy.
// Actually, for Credentials + Database, we keep logic in auth.ts 
// and only simple config here.
// But Credentials verify() usually needs DB.
// Pattern: auth.config.ts has providers [], auth.ts extends it.

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        // This runs on Node runtime (in auth.ts context), so bcrypt is fine.
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          
          // We can't import prisma here if this file is used in middleware directly.
          // BUT middleware only needs to verify session token, not re-credential.
          // So we return null here in edge-config and override in auth.ts?
          // No, authorize() is not called in middleware.
          // So it's safe to define partial logic or keep it empty here 
          // and spread in auth.ts.
          return null; 
        }

        return null;
      }
    })
  ],
} satisfies NextAuthConfig
