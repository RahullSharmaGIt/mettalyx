import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import authConfig from "@/auth.config"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/schemas"
import { compare } from "bcryptjs"
import { UserRole } from "@prisma/client"

export const {  
  handlers: { GET, POST },
  auth,
  signIn,
  signOut, 
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {

    // session callback (runs when session is read)
    // What this does:
    // Copies id + role from JWT → session.user
    // Makes them available everywhere

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isOnboarded = token.isOnboarded as boolean;
      }
      
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await prisma.user.findUnique({
        where: { id: token.sub },
        include: { vendorProfile: true }
      });

      if (!existingUser) return token;

      token.role = existingUser.role;
      token.isOnboarded = false;

      if (existingUser.role === UserRole.VENDOR) {
          token.isOnboarded = existingUser.vendorProfile?.isOnboarded ?? false;
      }

      return token;
    } 
  },
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await compare(password, user.password);

          if (passwordsMatch) return user;

          //  const passwordsMatch = await bcrypt.compare(password, user.password);
        // if (!passwordsMatch) return null;
        }

        return null;
      }
    })
  ],
})


// Flow:

// Validate input with Zod (LoginSchema)
// Look up user by email
// Compare hashed password (bcryptjs)
// Return user if valid
// Returning user = successful login
// Returning null = login failed

