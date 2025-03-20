"use client";

import { SignIn } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get and decode the redirect URL if it's encoded
  const redirectParam = searchParams.get("redirect_url") || "/";
  const redirectUrl = redirectParam.startsWith("%2F")
    ? decodeURIComponent(redirectParam)
    : redirectParam;

  const [showSignIn, setShowSignIn] = useState(false);

  // For debugging
  useEffect(() => {
    console.log("Redirect URL:", redirectUrl);
  }, [redirectUrl]);

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log("User is signed in, redirecting to:", redirectUrl);
      router.push(redirectUrl);
    } else if (isLoaded && !isSignedIn) {
      setShowSignIn(true);
    }
  }, [isLoaded, isSignedIn, router, redirectUrl]);

  if (!isLoaded || !showSignIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full px-4">
        <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden shadow-md">
          {/* Left side - Branding/Welcome */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-gradient-to-br from-blue-400 to-purple-400">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome Back!
              </h2>
              <p className="text-white mb-6">
                Sign in to access your dashboard and continue your journey with
                us.
              </p>
              {/* Logo placeholder */}
              <div className="hidden md:block opacity-90">
                <div className="h-32 w-32 rounded-full bg-white/30 flex items-center justify-center mx-auto md:mx-0">
                  <span className="text-white text-3xl font-bold">AMS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Sign In Component */}
          <div className="w-full md:w-1/2 p-8 bg-gradient-to-tr from-gray-400 to-gray-300">
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-blue-500 hover:bg-blue-600 text-sm normal-case",
                  card: "bg-transparent shadow-none",
                  headerTitle: "text-gray-800",
                  headerSubtitle: "text-gray-600",
                  socialButtonsBlockButton:
                    "bg-gray-100 hover:bg-gray-200 border-gray-300",
                  socialButtonsBlockButtonText: "text-gray-700",
                  dividerLine: "bg-gray-300",
                  dividerText: "text-gray-500",
                  formFieldLabel: "text-gray-700",
                  formFieldInput: "bg-white border-gray-300 text-gray-900",
                  footerActionLink: "text-blue-500 hover:text-blue-600",
                  footerActionText: "text-gray-600",
                },
              }}
              path="/sign-in"
              routing="path"
              redirectUrl={redirectUrl}
              signUpUrl="/sign-up"
              afterSignInUrl={redirectUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
