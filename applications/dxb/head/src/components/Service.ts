import { graphql } from "gatsby";
import { RoofProLevel } from "@bmi/company-details";

export const serviceTypes = [
  "Pitched roof",
  "Flat roof",
  "Pitched roof - Bitumen roofs",
  "Pitched roof - Tile roofs",
  "Pitched roof - Roof coaters",
  "Headquarters",
  "Country offices",
  "Manufacturing and export",
  "Technical centre & BMI academy"
] as const;

export type ServiceType = typeof serviceTypes[number];

export const serviceTypesByEntity = (entityType: string) => {
  if (entityType === "Roofer") {
    return serviceTypes.slice(0, 4);
  } else if (entityType === "Branch") {
    return serviceTypes.slice(5, 8);
  } else return [];
};

export type Data = {
  __typename: "ContentfulService";
  id: string;
  entryType: "Roofer" | "Branch" | "Merchant";
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
    certification
    summary
  }
`;
