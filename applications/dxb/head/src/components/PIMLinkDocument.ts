import { graphql } from "gatsby";

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
    isLinkDocument
    url
    docName
    assetType {
      ...AssetTypeFragment
    }
  }
`;
