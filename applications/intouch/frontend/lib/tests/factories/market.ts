import { Market } from "@bmi/intouch-api-types";
import { ContextProps } from "../../../context/MarketContext";

export const generateMarketContext = (
  marketInfo: Partial<Market> = {}
): ContextProps["market"] => ({
  ...{
    __typename: "Market",
    nodeId: "1",
    id: 1,
    name: "Mapleland",
    domain: "en",
    language: "EN",
    cmsSpaceId: "opay6t6wwmup",
    locationBiasRadiusKm: 100,
    geoMiddle: {
      x: 51.5014,
      y: -0.1419
    },
    sendName: "BMI Group Norway",
    sendMailbox: "noreply@bmigroup.no",
    doceboInstallersBranchId: "1",
    createdAt: "2021-08-23 18:05:17.659497",
    updatedAt: "2021-08-23 18:05:17.659497"
  },
  ...marketInfo
});
