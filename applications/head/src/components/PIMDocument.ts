import { graphql } from "gatsby";
import { Category, Classification } from "../templates/product-details-page";
import { Data as AssetTypeData } from "./AssetType";

export type Data = {
  __typename: "PIMDocument";
  id: string;
  title: string;
  // Is this variant or base product? Worth noting wrt typing
  product: {
    code: string;
    name: string;
    categories: readonly Category[];
    classifications: readonly Classification[];
  };
  url: string;
  assetType: AssetTypeData;
  fileSize: number;
  format: string;
  extension: string;
};

export const query = graphql`
  fragment PIMDocumentFragment on PIMDocument {
    __typename
    id
    title
    product {
      code
      name
      categories {
        categoryType
        code
        name
        parentCategoryCode
      }
      classifications {
        name
        code
        features {
          name
          code
          featureValues {
            value
            code
          }
          featureUnit {
            symbol
          }
        }
      }
    }
    url
    assetType {
      ...AssetTypeFragment
    }
    fileSize
    format
    extension
  }
`;
