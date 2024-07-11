import { RoofProLevel } from "@bmi-digital/components/company-details";
import { Data as ContentfulImageData } from "./image/contentful-image/types";
import { Data as ServiceType } from "./ServiceType";

export enum EntryTypeEnum {
  ROOFER_TYPE = "Roofer",
  BRANCH_TYPE = "Branch",
  MERCHANT_TYPE = "Merchant"
}
export enum ServiceTypesPrefixesEnum {
  Roofer = "findARoofer",
  Branch = "findABranch",
  Merchant = "findAMerchant"
}

export type ServiceTypeFilter = Record<string, boolean>;

export type Data = {
  __typename: "Roofer";
  id: string;
  entryType: EntryTypeEnum;
  name: string;
  location: {
    lat: number;
    lon: number;
  };
  address: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedIn: string | null;
  websiteLinkAsLabel: boolean | null;
  fax: string | null;
  companyLogo: ContentfulImageData | null;
  serviceTypes: ServiceType[] | null;
  certification: RoofProLevel | null;
  summary: string | null;
};
