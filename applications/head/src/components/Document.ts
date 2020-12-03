import { graphql } from "gatsby";
import { Data as AssetTypeData } from "./AssetType";
import { Document } from "@contentful/rich-text-types";

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
  description: {
    // TODO: add validations for this Rich Text field in CMS
    json: Document;
  } | null;
  brand: string;
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
    description {
      json
    }
    brand
  }
`;
