import { graphql } from "gatsby";

export const rooferTypes = ["Pitched roof", "Flat roof"] as const;

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
  certification: string | null;
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
