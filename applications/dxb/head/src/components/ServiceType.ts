import { graphql } from "gatsby";

export type Data = {
  __typename: "ContentfulServiceType";
  name: string;
};

export const query = graphql`
  fragment ServiceTypeFragment on ContentfulServiceType {
    __typename
    name
  }
`;
