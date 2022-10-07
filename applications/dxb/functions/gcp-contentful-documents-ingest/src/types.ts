import { Brand } from "@bmi/contentful-types";
import { EntryFields } from "contentful";

export interface SysLink<T extends "Asset" | "Entry"> {
  type: "Link";
  linkType: T;
  id: string;
}

export type ContentfulDocument = {
  title: {
    [locale: string]: string;
  };
  asset: {
    [locale: string]: {
      sys: SysLink<"Asset">;
    };
  };
  description?: {
    [locale: string]: EntryFields.RichText;
  };
  assetType: {
    [locale: string]: {
      sys: SysLink<"Entry">;
    };
  };
  brand?: {
    [locale: string]: Brand;
  };
  featuredMedia?: {
    [locale: string]: {
      sys: SysLink<"Entry">;
    };
  };
  noIndex?: {
    [locale: string]: boolean;
  };
};
