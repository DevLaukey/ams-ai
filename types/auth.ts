export enum UserTier {
  TIER_1 = 1, // Basic - Chatbot only
  TIER_2 = 2, // Standard - Chatbot + Supply Stock Upload
  TIER_3 = 3, // Premium - Full Integration + Historical Data
}

export interface UserTierFeatures {
  chatbot: boolean;
  supplyUpload: boolean;
  historicalData: boolean;
  realTimeIntegration: boolean;
  advancedAnalytics: boolean;
  bulkQuoteComparison: boolean;
}

// Define features available for each tier
export const tierFeatures: Record<UserTier, UserTierFeatures> = {
  [UserTier.TIER_1]: {
    chatbot: true,
    supplyUpload: false,
    historicalData: false,
    realTimeIntegration: false,
    advancedAnalytics: false,
    bulkQuoteComparison: false,
  },
  [UserTier.TIER_2]: {
    chatbot: true,
    supplyUpload: true,
    historicalData: false,
    realTimeIntegration: false,
    advancedAnalytics: true,
    bulkQuoteComparison: false,
  },
  [UserTier.TIER_3]: {
    chatbot: true,
    supplyUpload: true,
    historicalData: true,
    realTimeIntegration: true,
    advancedAnalytics: true,
    bulkQuoteComparison: true,
  },
};
