// components/UpgradeBanner.tsx
import React from "react";
import { useTier } from "../context/TierContext";
import { UserTier, UserTierFeatures, tierFeatures } from "../types/auth";

interface UpgradeBannerProps {
  requiredFeature: keyof UserTierFeatures;
  message?: string;
}

export const UpgradeBanner: React.FC<UpgradeBannerProps> = ({
  requiredFeature,
  message,
}) => {
  const { getTierName } = useTier();

  // if (canAccess(requiredFeature)) {
  //   return null;
  // }

  // Find the minimum tier that has this feature
  let requiredTier = UserTier.TIER_1;
  for (const [tier, features] of Object.entries(tierFeatures)) {
    if (features[requiredFeature]) {
      requiredTier = Number(tier) as UserTier;
      break;
    }
  }

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-indigo-800 font-medium">
            {message ||
              `This feature requires ${getTierName(requiredTier)} tier`}
          </h3>
          <p className="text-indigo-600 text-sm mt-1">
            Upgrade to unlock more powerful features for your hospital supply
            management.
          </p>
        </div>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
};
