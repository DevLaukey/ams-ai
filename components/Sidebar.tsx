"use client";

import React from "react";
import { useTier } from "../context/TierContext";
import { UserTier } from "../types/auth";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation } from "./sidebar//SidebarNavigation";
import { UserProfile } from "./sidebar//UserProfile";
import { updateToTier2, updateToTier3 } from "./sidebar//TierHelpers";

export default function Sidebar() {
  const { currentTier } = useTier();

  // Get sidebar background color based on tier
  const getSidebarColor = () => {
    switch (currentTier) {
      case UserTier.TIER_1: // Chat Only
        return "bg-white";
      case UserTier.TIER_2: // Inventory Data
        return "bg-blue-50";
      case UserTier.TIER_3: // Full Integration
        return "bg-purple-50";
      default:
        return "bg-white";
    }
  };

  // Get border color based on tier
  const getBorderColor = () => {
    switch (currentTier) {
      case UserTier.TIER_1:
        return "border-gray-200";
      case UserTier.TIER_2:
        return "border-blue-200";
      case UserTier.TIER_3:
        return "border-purple-200";
      default:
        return "border-gray-200";
    }
  };

  return (
    <div
      className={`w-64 ${getSidebarColor()} h-full flex flex-col border-r ${getBorderColor()} shadow-sm`}
    >
      <SidebarHeader currentTier={currentTier} />
      <SidebarNavigation
        currentTier={currentTier}
        updateToTier2={updateToTier2}
        updateToTier3={updateToTier3}
      />
      <UserProfile />
    </div>
  );
}
