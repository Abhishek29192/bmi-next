import { graphql } from "gatsby";

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
    isLinkDocument
    docName
  }
`;
