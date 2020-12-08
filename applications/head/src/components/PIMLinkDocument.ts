import { graphql } from "gatsby";
import { Data as AssetTypeData } from "./AssetType";

export type Data = {
  __typename: "PIMLinkDocument";
  id: string;
  title: string;
  product: {
    code: string;
    name: string;
  };
  url: string;
  assetType: AssetTypeData;
};

export const query = graphql`
  fragment PIMLinkDocumentFragment on PIMLinkDocument {
    __typename
    id
    title
    product {
      code
      name
    }
    url
    assetType {
      ...AssetTypeFragment
    }
  }
`;
