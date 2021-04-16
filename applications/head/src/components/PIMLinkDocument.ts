import { graphql } from "gatsby";
import { PIMDocumentBase } from "./PIMDocumentBase";

export type Data = PIMDocumentBase & {
  __typename: "PIMLinkDocument";
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
