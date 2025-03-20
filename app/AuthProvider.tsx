"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Authentication redirect component
function AuthRedirect({ children }) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Protected routes that require authentication
  const protectedRoutes = [
    '/',
    "/account",
    "/chat",
    "/compare-quotes",
    "/integration-setup",
    "/product-feedback",
    "/request-quote",
    "/supply-exchange",
  ];

  // Public routes that don't require auth
  const publicRoutes = ["/sign-in", "/sign-up", ];

  useEffect(() => {
    if (!isLoaded) return;

    const isProtectedRoute = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isProtectedRoute && !userId) {
      // Redirect to sign-in if trying to access protected route while not authenticated
      router.push("/sign-in");
    } else if (isPublicRoute && userId) {
      // Optional: redirect to dashboard if accessing public route while authenticated
      // router.push("/dashboard");
    }
  }, [isLoaded, userId, pathname, router]);

  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <AuthRedirect>{children}</AuthRedirect>
    </ClerkProvider>
  );
}
// "use client";

// import { ClerkProvider } from "@clerk/nextjs";

// export function Providers({ children }: { children: React.ReactNode }) {
//   return <ClerkProvider>{children}</ClerkProvider>;
// }