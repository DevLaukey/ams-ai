import { UserTier } from "../../types/auth";

export const updateToTier2 = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/users/update-tier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tier: UserTier.TIER_2 }),
    });

    if (!response.ok) {
      throw new Error("Failed to update to Tier 2");
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error updating to Tier 2:", error);
    return false;
  }
};

export const updateToTier3 = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/users/update-tier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tier: UserTier.TIER_3 }),
    });

    if (!response.ok) {
      throw new Error("Failed to update to Tier 3");
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error updating to Tier 3:", error);
    return false;
  }
};
