import { graphql } from "gatsby";
import { Data as AssetTypeData } from "./AssetType";

export type Data = {
  __typename: "ContentfulDocument";
  id: string;
  title: string;
  assetType: AssetTypeData;
  image: {
    resize: {
      src: string;
    };
  } | null;
  asset: {
    file: {
      url: string;
      fileName: string;
      contentType: string;
      details: {
        size: number;
      };
    };
  };
};

export const query = graphql`
  fragment DocumentFragment on ContentfulDocument {
    __typename
    id
    title
    assetType {
      ...AssetTypeFragment
    }
    image {
      resize(height: 180) {
        src
      }
    }
    asset {
      file {
        url
        fileName
        contentType
        details {
          size
        }
      }
    }
  }
`;
