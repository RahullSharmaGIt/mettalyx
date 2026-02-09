import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  adminRoutes,
  oemRoutes,
  vendorRoutes
} from "@/routes"
import { UserRole } from "@prisma/client"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const user = req.auth?.user
  
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  
  const isAdminRoute = nextUrl.pathname.startsWith(adminRoutes)
  const isOemRoute = nextUrl.pathname.startsWith(oemRoutes)
  const isVendorRoute = nextUrl.pathname.startsWith(vendorRoutes)

  if (isApiAuthRoute) {
    return null 
  }
  console.log("ROLE:", user?.role);

  if (isAuthRoute) {
    if (isLoggedIn) {
      if (user?.role === "ADMIN") return Response.redirect(new URL("/admin/dashboard", nextUrl))
      if (user?.role === "OEM") return Response.redirect(new URL("/oem/dashboard", nextUrl))
      if (user?.role === "VENDOR") {
          return Response.redirect(new URL("/vendor", nextUrl))
        }
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null
  }

  if (!isLoggedIn && !isPublicRoute) { 
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  // Role Base Protection
  if (isLoggedIn && user) {
    if (isAdminRoute && user.role !== UserRole.ADMIN) {
        return Response.redirect(new URL("/dashboard", nextUrl))
    }
    if (isOemRoute && user.role !== UserRole.OEM) {
        return Response.redirect(new URL("/dashboard", nextUrl))
    }
    if (isVendorRoute && user.role !== UserRole.VENDOR) {
        return Response.redirect(new URL("/dashboard", nextUrl))
    }
  }

  return null
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
