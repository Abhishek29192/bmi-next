import { graphql } from "gatsby";
import { Data as AssetTypeData } from "./AssetType";
import { Category, Classification } from "../templates/product-details-page";

export type Data = {
  __typename: "PIMLinkDocument";
  id: string;
  title: string;
  product: {
    code: string;
    name: string;
    categories: readonly Category[];
    classifications: readonly Classification[];
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
  }
`;
