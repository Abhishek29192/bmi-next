import { graphql } from "gatsby";
import { RoofProLevel } from "@bmi/company-details";

export const rooferTypes = [
  "Pitched roof",
  "Flat roof",
  "Pitched roof - Bitumen roofs",
  "Pitched roof - Tile roofs",
  "Pitched roof - Roof coaters",
  "Pitched roof - Roof coaters"
];

export const branchTypes = [
  "Headquarters",
  "Country offices",
  "Manufacturing and export",
  "Technical centre & BMI academy"
];

export const merchantTypes = [
  "BMI Redland Pitched roof systems",
  "BMI Icopal Flat roof Systems",
  "Dépôts de proximité Siplast",
  "Distributeurs Siplast",
  "Distributeurs Monier"
];

export type ServiceType =
  | typeof rooferTypes[number]
  | typeof branchTypes[number]
  | typeof merchantTypes[number];

export const ROOFER_TYPE = "Roofer";
export const BRANCH_TYPE = "Branch";
export const MERCHANT_TYPE = "Merchant";
export type EntryType = "Roofer" | "Branch" | "Merchant";
export enum ServiceTypesPrefixesEnum {
  Roofer = "findARoofer",
  Branch = "findABranch",
  Merchant = "findAMerchant"
}
export enum ServiceTypesEnum {
  type = "Roofer",
  branchType = "Branch",
  merchantType = "Merchant"
}

export const serviceTypesByEntity = (entityType: EntryType) => {
  switch (entityType) {
    case ROOFER_TYPE:
      return rooferTypes;
    case BRANCH_TYPE:
      return branchTypes;
    case MERCHANT_TYPE:
      return merchantTypes;
    default:
      return [];
  }
};

export type Data = {
  __typename: "ContentfulService";
  id: string;
  entryType: EntryType;
  name: string;
  location: {
    lat: number;
    lon: number;
  };
  address: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  fax: string | null;
  type: ServiceType[] | null;
  branchType: ServiceType[] | null;
  merchantType: ServiceType[] | null;
  certification: RoofProLevel | null;
  summary: string | null;
};

export const query = graphql`
  fragment ServiceFragment on ContentfulService {
    __typename
    id
    entryType
    name
    location {
      lat
      lon
    }
    address
    phone
    email
    website
    fax
    type
    branchType
    merchantType
    certification
    summary
  }
`;
