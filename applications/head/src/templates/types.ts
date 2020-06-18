import { Document } from "@contentful/rich-text-types";

export type Json = {
  json: Document;
};

export type Site = {
  siteMetadata: Metadata;
};

export type Metadata = {
  title: string;
};
