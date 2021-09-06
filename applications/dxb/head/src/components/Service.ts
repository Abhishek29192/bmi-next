import { graphql } from "gatsby";
import { RoofProLevel } from "@bmi/company-details";

export const serviceTypes = [
  "Pitched roof",
  "Flat roof",
  "Pitched roof - Bitumen roofs",
  "Pitched roof - Tile roofs",
  "Pitched roof - Roof coaters"
] as const;

export type ServiceType = typeof serviceTypes[number];

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
    certification
    summary
  }
`;
