"use client";

import React from "react";
import {
  Home,
  MessageSquare,
  BarChart2,
  FileText,
  Settings,
  ShoppingCart,
  RefreshCcw,
  MessageCircle,
  LineChart,
  User,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { TierUpgradeUI } from "./TierUpgradeUI";
import { UserTier } from "../../types/auth";

interface SidebarNavigationProps {
  currentTier: UserTier;
  updateToTier2: () => Promise<boolean>;
  updateToTier3: () => Promise<boolean>;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  currentTier,
  updateToTier2,
  updateToTier3,
}) => {
  return (
    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
      <SidebarItem
        icon={<Home size={18} />}
        text="Dashboard"
        href="/"
        tier={currentTier}
      />
      {/* Chat functionality - Available to all tiers */}
      <SidebarItem
        icon={<MessageSquare size={18} />}
        text="AMS AI Chat"
        href="/chat/new"
        expanded
        tier={currentTier}
        subItems={[
          { text: "New Chat", href: "/chat/new" },
          { text: "History", href: "/chat/history" },
        ]}
      />

      {/* Tier 2 and above features - Inventory based */}
      <div className="pt-2 mt-2 border-t border-gray-200">
        <div className="px-2 py-1 text-xs text-gray-500 font-medium">
          {currentTier >= UserTier.TIER_2
            ? "Inventory Data Features"
            : "Inventory Data Features (Unavailable)"}
        </div>

        <TierUpgradeUI
          currentTier={currentTier}
          updateToTier2={updateToTier2}
          updateToTier3={updateToTier3}
        />

        <SidebarItem
          icon={<ShoppingCart size={18} />}
          text="Inventory Management"
          href="/inventory"
          tier={currentTier}
          requiredTier={UserTier.TIER_2}
        />
        <SidebarItem
          icon={<BarChart2 size={18} />}
          text="Compare Products"
          href="/compare-products"
          tier={currentTier}
          requiredTier={UserTier.TIER_2}
        />
        {/* <SidebarItem
          icon={<ListOrdered size={18} />}
          text="Hot List"
          href="/hot-list"
          tier={currentTier}
          requiredTier={UserTier.TIER_2}
        /> */}
      </div>

      {/* Tier 3 features - Full Integration */}
      <div className="pt-2 mt-2 border-t border-gray-200">
        <div className="px-2 py-1 text-xs text-gray-500 font-medium">
          {currentTier >= UserTier.TIER_3
            ? "Full Integration Features"
            : "Full Integration Features (Unavailable)"}
        </div>

        <SidebarItem
          icon={<Settings size={18} />}
          text="AI Agent"
          href="/ai-agent"
          expanded
          tier={currentTier}
          requiredTier={UserTier.TIER_3}
        />
        <SidebarItem
          icon={<LineChart size={18} />}
          text="Predictive Analytics"
          href="/analytics"
          tier={currentTier}
          requiredTier={UserTier.TIER_3}
        />
        <SidebarItem
          icon={<RefreshCcw size={18} />}
          text="Supply Exchange"
          href="/supply-exchange/catalog"
          expanded
          tier={currentTier}
          requiredTier={UserTier.TIER_3}
          subItems={[{ text: "Catalog", href: "/supply-exchange/catalog" }]}
        />
      </div>

      {/* Common features across all tiers */}
      <div className="pt-2 mt-2 border-t border-gray-200">
        <SidebarItem
          icon={<FileText size={18} />}
          text="Request for Quote"
          href="/request-quote"
          expanded
          tier={currentTier}
        />
        <SidebarItem
          icon={<MessageCircle size={18} />}
          text="Product Feedback"
          href="/product-feedback"
          tier={currentTier}
        />
        <SidebarItem
          icon={<User size={18} />}
          text="Account & Subscription"
          href="/account"
          tier={currentTier}
        />
      </div>
    </nav>
  );
};
