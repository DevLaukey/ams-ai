import React from "react";
import { UserTier } from "../../types/auth";

interface SidebarHeaderProps {
  currentTier: UserTier;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  currentTier,
}) => {
  // Get logo color based on tier
  const getLogoColor = () => {
    switch (currentTier) {
      case UserTier.TIER_1:
        return "text-gray-700";
      case UserTier.TIER_2:
        return "text-blue-600";
      case UserTier.TIER_3:
        return "text-purple-600";
      default:
        return "text-gray-700";
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

  // Custom tier description
  const getTierDescription = () => {
    switch (currentTier) {
      case UserTier.TIER_1:
        return "Chat Only";
      case UserTier.TIER_2:
        return "Inventory Data";
      case UserTier.TIER_3:
        return "Full Integration";
      default:
        return "Basic";
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 py-6 border-b ${getBorderColor()}`}
    >
      <span className={`${getLogoColor()} font-bold text-xl`}>AMS AI</span>
      <div
        className="text-xs font-medium px-2 py-1 rounded-md bg-opacity-80"
        style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
      >
        {getTierDescription()}
      </div>
    </div>
  );
};
