"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";
import { UserTier } from "../../types/auth";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  href: string;
  expanded?: boolean;
  subItems?: { text: string; href: string }[];
  onClick?: () => void;
  requiredTier?: UserTier; // Minimum tier required to access this feature
}

export const SidebarItem: React.FC<SidebarItemProps & { tier: UserTier }> = ({
  icon,
  text,
  href,
  expanded = false,
  subItems = [],
  onClick,
  tier,
  requiredTier,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const [isOpen, setIsOpen] = React.useState(false);

  // Check if this feature is available in the current tier
  const isAvailable = !requiredTier || tier >= requiredTier;

  // Get tier-specific colors
  const getTierColors = () => {
    switch (tier) {
      case UserTier.TIER_1: // Chat Only - Gray theme
        return {
          icon: "text-gray-600",
          activeBackground: "bg-gray-100",
          activeText: "text-gray-800",
          hoverBackground: "hover:bg-gray-50",
        };
      case UserTier.TIER_2: // Inventory Data - Blue theme
        return {
          icon: "text-blue-600",
          activeBackground: "bg-blue-50",
          activeText: "text-blue-800",
          hoverBackground: "hover:bg-blue-50",
        };
      case UserTier.TIER_3: // Full Integration - Purple theme
        return {
          icon: "text-purple-600",
          activeBackground: "bg-purple-50",
          activeText: "text-purple-800",
          hoverBackground: "hover:bg-purple-50",
        };
      default:
        return {
          icon: "text-gray-600",
          activeBackground: "bg-gray-100",
          activeText: "text-gray-800",
          hoverBackground: "hover:bg-gray-50",
        };
    }
  };

  const colors = getTierColors();

  // If there's an onClick handler, use it instead of navigation
  if (onClick) {
    return (
      <div className="relative group">
        <div
          onClick={onClick}
          className={`
            flex items-center space-x-2 p-2 rounded-lg cursor-pointer relative
            ${colors.hoverBackground} text-gray-700
          `}
        >
          <span className={colors.icon}>{icon}</span>
          <span className="flex-1 font-medium">{text}</span>
        </div>
      </div>
    );
  }

  // If feature is locked, show a disabled version
  if (!isAvailable) {
    return (
      <div className="relative group">
        <div className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 opacity-60 cursor-not-allowed">
          <span className="text-gray-400">{icon}</span>
          <span className="flex-1 font-medium">{text}</span>
          {expanded && (
            <div className="p-1 rounded-full text-gray-400">
              <ChevronDown size={16} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Link href={href}>
        <div
          className={`
            flex items-center space-x-2 p-2 rounded-lg cursor-pointer relative
            ${
              isActive
                ? `${colors.activeBackground} ${colors.activeText}`
                : `${colors.hoverBackground} text-gray-700`
            }
          `}
        >
          <span className={colors.icon}>{icon}</span>
          <span className="flex-1 font-medium">{text}</span>
          {expanded && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </Link>

      {expanded && isOpen && subItems.length > 0 && (
        <div className="ml-6 mt-1 space-y-0.5">
          {subItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div
                className={`p-2 text-sm text-gray-600 ${colors.hoverBackground} rounded-lg cursor-pointer`}
              >
                {item.text}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
