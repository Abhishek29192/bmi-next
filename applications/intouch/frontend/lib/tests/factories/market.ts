import { Market } from "@bmi/intouch-api-types";

export const generateMarket = (
  marketInfo: Partial<Market> = {}
): Partial<Market> => ({
  name: "Mapleland",
  domain: "en",
  language: "EN",
  cmsSpaceId: "opay6t6wwmup",
  geoMiddle: {
    x: 51.5014,
    y: -0.1419
  },
  ...marketInfo
});
