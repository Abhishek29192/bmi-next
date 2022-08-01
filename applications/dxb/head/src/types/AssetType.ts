import { graphql } from "gatsby";
import { RichTextData } from "../components/RichText";

export type ContentfulAssetType = {
  __typename: "ContentfulAssetType";
  id: string;
  name: string;
  code: string;
  description: RichTextData | null;
  pimCode: string | null;
};

export const query = graphql`
  fragment AssetTypeFragment on ContentfulAssetType {
    __typename
    id
    name
    code
    description {
      raw
    }
    pimCode
  }
`;
