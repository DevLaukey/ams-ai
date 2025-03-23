import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Configure the middleware to exclude webhook routes
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/webhooks routes
     * 2. /_next (Next.js internals)
     * 3. static files (.css, .js, .ico, etc)
     */
    "/((?!api/webhooks|_next|.*\\..*).*)",
  ],
};
