import { graphql } from "gatsby";
import { Document } from "@contentful/rich-text-types";

export type Data = {
  __typename: "ContentfulAssetType";
  id: string;
  name: string;
  code: string;
  description: { json: Document } | null;
  pimCode: string | null;
};

export const query = graphql`
  fragment AssetTypeFragment on ContentfulAssetType {
    __typename
    id
    name
    code
    description {
      json
    }
    pimCode
  }
`;
