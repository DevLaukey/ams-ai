"use client";

import { useUser, UserButton } from "@clerk/nextjs";

/**
 * Welcome component displaying the main header, user greeting,
 * and any additional main content using Clerk user data.
 */
export default function Welcome() {
  const { user, isLoaded } = useUser();

  // Show loading state while user data is being fetched
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">model</h1>
          <span className="text-sm text-gray-400">techx 1.0</span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Clerk's UserButton component for profile management */}
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-4xl mb-4 mt-8">
          <span className="text-blue-400">Hello</span>
          <span className="text-pink-400">
            , {user?.firstName || user?.username || "there"}
          </span>
        </h2>
      </div>
    </>
  );
}
