"use client";

import React from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useTier } from "../../context/TierContext";
import { TierFlag } from "./TierFlag";

export const UserProfile: React.FC = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const { currentTier } = useTier();
  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  if (!user) {
    return (
      <div className="p-4 border-t border-gray-200 bg-gray-50 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Get user info from Clerk
  const name = `${user.firstName} ${user.lastName}` || user.firstName || "User";
  const email = user.emailAddresses[0]?.emailAddress || "";
  const imageUrl = user.imageUrl;
  const role = "Purchasing Manager"; // This would typically come from your app's role management

  return (
    <div className="border-t border-gray-200 bg-gray-50 relative">
      <TierFlag tier={currentTier} />
      <div className="flex items-center space-x-3 p-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shadow-sm">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-500 truncate">{role}</p>
          <p className="text-xs text-gray-500 truncate">{email}</p>
        </div>
      </div>

      {/* Logout button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center space-x-2 p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
