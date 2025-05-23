import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/products",
  "/categories",
  "/about",
  "/contact",
  "/auth/signin",
  "/auth/signup",
  "/auth/verify",
  "/auth/error",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/account-disabled",
  "/403",
  "/404",
  "/500",
];

// API routes that should be public
const publicApiRoutes = [
  "/api/auth",
  "/api/sign-up",
  "/api/public",
  "/api/products/public",
  "/api/categories/public",
];

// Admin routes that require admin role
const adminRoutes = ["/admin", "/dashboard/admin"];

// Check if a route is public
function isPublicRoute(pathname: string): boolean {
  // Check exact matches and prefix matches
  return (
    publicRoutes.some((route) => {
      if (route === "/") return pathname === "/";
      return pathname.startsWith(route);
    }) || publicApiRoutes.some((route) => pathname.startsWith(route))
  );
}

// Check if a route is admin only
function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some((route) => pathname.startsWith(route));
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow access to public routes
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    // If no token and not a public route, redirect to signin
    if (!token) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Check if user account is active
    if (token.isActive === false) {
      return NextResponse.redirect(new URL("/auth/account-disabled", req.url));
    }

    // Check admin routes
    if (isAdminRoute(pathname) && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Always allow access to public routes
        if (isPublicRoute(pathname)) {
          return true;
        }

        // For protected routes, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/placeholder (placeholder API)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|api/placeholder).*)",
  ],
};
