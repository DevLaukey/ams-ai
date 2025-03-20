import React from "react";

interface TierFlagProps {
  tier: number;
}

export const TierFlag: React.FC<TierFlagProps> = ({ tier }) => {
  const getTierName = (tier: number): string => {
    switch (tier) {
      case 1:
        return "Basic";
      case 2:
        return "Pro";
      case 3:
        return "Enterprise";
      default:
        return "Basic";
    }
  };

  const getTierColor = () => {
    switch (tier) {
      case 1:
        return "bg-gray-100 border-gray-300 text-gray-800";
      case 2:
        return "bg-blue-100 border-blue-300 text-blue-800";
      case 3:
        return "bg-purple-100 border-purple-300 text-purple-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  return (
    <div
      className={`absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-medium border ${getTierColor()}`}
    >
      {getTierName(tier)}
    </div>
  );
};
