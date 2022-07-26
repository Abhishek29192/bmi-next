/**
 * These types are not fully complete, they are just here to allow type
 * expectations for the resolvers. These types should match what is in the
 * main types, but with any "link" fields and without any resolver created
 * fields.
 */
import { Node } from "gatsby";
import { RichTextData } from "../../../components/RichText";

export type Resource = Node & {
  keyAssetTypes: string[] | null;
};

export type ContentfulAssetType = Node & {
  __typename: "ContentfulAssetType";
  id: string;
  name: string;
  code: string;
  description: RichTextData | null;
  pimCode: string | null;
};

export type Source = "PIM" | "CMS" | "ALL";

export type ContentfulDocumentLibraryPage = Node & {
  source: Source;
  assetTypes___NODE: string[] | null;
};

export type ContentfulDocument = Node & {
  __typename: "ContentfulDocument";
  id: string;
  title: string;
  assetType___NODE: string;
  featuredMedia___Node: string | null;
  asset___Node: string | null;
  // TODO: add validations for this Rich Text field in CMS
  description: RichTextData | null;
  brand: string;
  noIndex: boolean;
};
