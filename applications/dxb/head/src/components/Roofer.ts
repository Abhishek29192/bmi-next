import { graphql } from "gatsby";
import { RoofProLevel } from "@bmi/company-details";

export const rooferTypes = [
  "Pitched roof",
  "Flat roof",
  "Pitched roof - Bitumen roofs",
  "Pitched roof - Tile roofs",
  "Pitched roof - Roof coaters"
] as const;

export type RooferType = typeof rooferTypes[number];

export type Data = {
  __typename: "ContentfulRoofer";
  id: string;
  name: string;
  location: {
    lat: number;
    lon: number;
  };
  address: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  type: RooferType[] | null;
  certification: RoofProLevel | null;
  summary: string | null;
};

export const query = graphql`
  fragment RooferFragment on ContentfulRoofer {
    __typename
    id
    name
    location {
      lat
      lon
    }
    address
    phone
    email
    website
    type
    certification
    summary
  }
`;
