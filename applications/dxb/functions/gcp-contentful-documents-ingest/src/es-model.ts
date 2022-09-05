export type ContentfulAsset = {
  file: {
    fileName: string;
    url: string;
    details: Record<"size", number>;
    contentType: "application/pdf";
  };
};

interface Brand {
  code: string;
  name: string;
}

export type ContentfulAssetType = {
  name: string;
  code: string;
  description?: string;
  pimCode?: string | null;
};
export interface ESContentfulDocument {
  __typename: "ContentfulDocument";
  id: string;
  title: string;
  titleAndSize: string;
  realFileName: string;
  asset: ContentfulAsset;
  assetType: ContentfulAssetType;
  noIndex?: boolean;
  BRAND?: Brand;
  description?: unknown;
}
