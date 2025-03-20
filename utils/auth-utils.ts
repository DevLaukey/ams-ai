// utils/auth-utils.ts
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Client component wrapper to check authentication and redirect if needed
 * Call this function at the top of any page component that requires authentication
 */
export async function requireAuth() {
  const user = await auth();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  return user;
}

/**
 * Client component wrapper to check if user is already authenticated
 * Use this to redirect authenticated users away from auth pages
 */
export async function redirectIfAuthenticated() {
  const user = await currentUser();
  
  if (user) {
    redirect("/");
  }
  
  return null;
}