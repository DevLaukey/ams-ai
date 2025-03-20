"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export enum UserTier {
  TIER_1 = 1, // Basic - Chat Only
  TIER_2 = 2, // Pro - Inventory Data
  TIER_3 = 3, // Enterprise - Full Integration
}

interface TierContextType {
  currentTier: UserTier;
  getTierName: (tier: number) => string;
  updateToTier2: () => Promise<boolean>;
  updateToTier3: () => Promise<boolean>;
  isUpdatingTier: boolean;
  tierUpdateError: string | null;
}

const TierContext = createContext<TierContextType | undefined>(undefined);

export const TierProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoaded } = useUser();
  const [currentTier, setCurrentTier] = useState<UserTier>(UserTier.TIER_1);
  const [isUpdatingTier, setIsUpdatingTier] = useState(false);
  const [tierUpdateError, setTierUpdateError] = useState<string | null>(null);

  // Load user tier from database when user is loaded
  useEffect(() => {
    const fetchUserTier = async () => {
      if (isLoaded && user) {
        try {
          const response = await fetch(`/api/users/tier?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            // Convert string tier to number if needed
            const tierValue =
              typeof data.tier === "string"
                ? parseInt(data.tier, 10)
                : data.tier;

            setCurrentTier(tierValue || UserTier.TIER_1);
          }
        } catch (error) {
          console.error("Error fetching user tier:", error);
        }
      }
    };

    fetchUserTier();
  }, [isLoaded, user]);

  // Helper function to update tier in database
  const updateTier = async (newTier: UserTier): Promise<boolean> => {
    if (!user) return false;

    setIsUpdatingTier(true);
    setTierUpdateError(null);

    try {
      const response = await fetch("/api/users/update-tier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tier: newTier }),
      });

      if (response.ok) {
        setCurrentTier(newTier);
        return true;
      } else {
        const error = await response.json();
        setTierUpdateError(error.message || "Failed to update tier");
        return false;
      }
    } catch (error) {
      console.error("Error updating tier:", error);
      setTierUpdateError("Network error while updating tier");
      return false;
    } finally {
      setIsUpdatingTier(false);
    }
  };

  // Update to Tier 2 (Inventory Data)
  const updateToTier2 = async (): Promise<boolean> => {
    // Only update if current tier is lower
    if (currentTier < UserTier.TIER_2) {
      return await updateTier(UserTier.TIER_2);
    }
    return true; // Already at or above Tier 2
  };

  // Update to Tier 3 (Full Integration)
  const updateToTier3 = async (): Promise<boolean> => {
    // Only update if current tier is lower
    if (currentTier < UserTier.TIER_3) {
      return await updateTier(UserTier.TIER_3);
    }
    return true; // Already at Tier 3
  };

  // Get tier name from tier number
  const getTierName = (tier: number): string => {
    switch (tier) {
      case UserTier.TIER_1:
        return "Basic";
      case UserTier.TIER_2:
        return "Pro";
      case UserTier.TIER_3:
        return "Enterprise";
      default:
        return "Basic";
    }
  };

  return (
    <TierContext.Provider
      value={{
        currentTier,
        getTierName,
        updateToTier2,
        updateToTier3,
        isUpdatingTier,
        tierUpdateError,
      }}
    >
      {children}
    </TierContext.Provider>
  );
};

export const useTier = (): TierContextType => {
  const context = useContext(TierContext);
  if (context === undefined) {
    throw new Error("useTier must be used within a TierProvider");
  }
  return context;
};
