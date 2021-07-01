import { graphql } from "gatsby";
import { Data as AssetTypeData } from "./AssetType";
import { RichTextData } from "./RichText";

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
  } | null;
  // TODO: add validations for this Rich Text field in CMS
  description: RichTextData | null;
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
      resize(width: 684, toFormat: WEBP, jpegProgressive: false) {
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
      raw
    }
    brand
  }
`;
