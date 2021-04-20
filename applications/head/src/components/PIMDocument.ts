import { graphql } from "gatsby";
import { PIMDocumentBase } from "./PIMDocumentBase";

export type Data = PIMDocumentBase & {
  __typename: "PIMDocument";
  fileSize: number;
  format: string;
  extension: string;
  realFileName: string;
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
    realFileName
  }
`;
