import { graphql } from "gatsby";

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
  type: string[] | null;
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
