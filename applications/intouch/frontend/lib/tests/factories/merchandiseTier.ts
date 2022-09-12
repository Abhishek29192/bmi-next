import {
  MerchandiseTier,
  UpdateMerchandiseTiersByMarketResult
} from "@bmi/intouch-api-types";

export const generateMerchandiseTier = (
  config: Partial<MerchandiseTier> = {}
) => {
  return {
    id: 1,
    marketId: 1,
    tierCode: "T1",
    merchandiseDivisionId: 1,
    ...config
  } as const;
};

export const generateMerchandiseTierResult = (
  MerchandiseTier: UpdateMerchandiseTiersByMarketResult = {}
) => {
  return {
    id: 1,
    market_id: 1,
    tier_code: "T1",
    merchandise_division_id: 123,
    ...MerchandiseTier
  };
};
