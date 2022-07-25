import {
  DoceboTier,
  UpdateDoceboTiersByMarketResult
} from "@bmi/intouch-api-types";

export const generateDoceboTier = (config: Partial<DoceboTier> = {}) => {
  return {
    id: 1,
    marketId: 1,
    tierCode: "T1",
    doceboCatalogueId: 1,
    ...config
  } as const;
};

export const genereateDoceboTierResult = (
  doceboTier: UpdateDoceboTiersByMarketResult = {}
) => {
  return {
    id: 1,
    market_id: 1,
    tier_code: "T1",
    docebo_catalogue_id: 123,
    ...doceboTier
  };
};
