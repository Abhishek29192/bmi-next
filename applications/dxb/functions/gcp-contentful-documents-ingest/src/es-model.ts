// TODO: The same types we use in gcp-pim-full-fetch-coordinator. We need to decouple those types into a separate library.
// https://bmigroup.atlassian.net/browse/DXB-4060
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
  id: string;
  name: string;
  code: string;
  description?: string;
  pimCode?: string | null;
};

type ImageData = {
  file: {
    fileName: string;
    url: string;
  };
};

export type FeaturedMediaData = {
  title: string;
  altText: string | null;
  type: "Decorative" | "Descriptive" | null;
  image: ImageData;
  caption: {
    caption: string;
  } | null;
  focalPoint: {
    x: number;
    y: number;
  } | null;
  thumbnail?: ImageData;
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
  featuredMedia?: FeaturedMediaData;
}
