import { graphql } from "gatsby";
import type {
  ContentfulDocument as EsContentfulDocument,
  PimProductDocument as EsPimDocument,
  PimSystemDocument as EsPimSystemDocument
} from "@bmi/elasticsearch-types/src";
import type { Data as ImageData } from "../components/image/contentful-image/types";
import type { RichTextData } from "../components/RichText";
import type { ContentfulAssetType as AssetTypeData } from "./AssetType";
import type {
  ProductDocument as FsPimDocument,
  PseudoZipPIMDocument,
  SystemDocument as FsPimSystemDocument
} from "./pim";

export type DocumentTableHeader =
  | "typeCode"
  | "type"
  | "name"
  | "title"
  | "size"
  | "add"
  | "productStatus"
  | "actions"
  | "validityDate";

export type ContentfulDocument = {
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
  };
  // TODO: add validations for this Rich Text field in CMS
  description: RichTextData | null;
  brand: string | null;
  noIndex: boolean | null;
};

export type Document =
  | ContentfulDocument
  | FsPimDocument
  | FsPimSystemDocument
  | PseudoZipPIMDocument
  | EsContentfulDocument
  | EsPimDocument
  | EsPimSystemDocument;

export type TitleField = "title" | "type";

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
