"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Client component wrapper to check authentication and redirect if needed
 * Use this for client components that need authentication
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      const currentPath = window.location.href;
      const redirectUrl = `/sign-in?redirect_url=${encodeURIComponent(
        currentPath
      )}`;
      router.push(redirectUrl);
    }
  }, [isLoaded, userId, router]);

  // Show loading state while auth state is being determined
  if (!isLoaded || !userId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="space-y-2">
            <div className="flex space-x-2">
              <div
                className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
