import { graphql } from "gatsby";
import { Data as AssetTypeData } from "./AssetType";

export type Data = {
  __typename: "PIMDocument";
  id: string;
  product: {
    code: string;
    name: string;
  };
  url: string;
  assetType: AssetTypeData;
  fileSize: number;
  format: string;
};

export const query = graphql`
  fragment PIMDocumentFragment on PIMDocument {
    __typename
    id
    product {
      code
      name
    }
    url
    assetType {
      ...AssetTypeFragment
    }
    fileSize
    format
  }
`;
