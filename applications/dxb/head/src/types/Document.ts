import { graphql } from "gatsby";
import { Data as ImageData } from "../components/Image";
import { RichTextData } from "../components/RichText";
import { Data as AssetTypeData } from "./AssetType";

export type Data = {
  __typename: "ContentfulDocument";
  id: string;
  title: string;
  assetType: AssetTypeData;
  featuredMedia: ImageData | null;
  asset: {
    file: {
      url: string;
      fileName: string;
      contentType: string;
      details: {
        size: number;
      };
    };
  } | null;
  // TODO: add validations for this Rich Text field in CMS
  description: RichTextData | null;
  brand: string;
  noIndex: boolean;
};

export const query = graphql`
  fragment DocumentFragment on ContentfulDocument {
    __typename
    id
    title
    assetType {
      ...AssetTypeFragment
    }
    featuredMedia {
      ...ImageDocumentFragment
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
      raw
    }
    brand
    noIndex
  }
`;
