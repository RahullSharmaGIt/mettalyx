import { UserRole } from "@prisma/client"
import NextAuth, { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isOnboarded: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}



// The next-auth.d.ts file is used to extend the default 
// TypeScript types provided by the NextAuth.js (now Auth.js) library,
//  allowing developers to add custom properties to the User, Session, and JWT objects. 