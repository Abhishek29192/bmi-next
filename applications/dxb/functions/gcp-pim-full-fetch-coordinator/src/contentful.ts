import contentful = require("contentful");
import logger from "@bmi-digital/functions-logger";
import { extractFeatureMediaData } from "./helpers";

export type ContentfulAsset = {
  file: {
    fileName: string;
    url: string;
    details: Record<"size", number>;
    contentType: "application/pdf";
  };
};

export type ContentfulAssetType = {
  __typename: "ContentfulAssetType";
  id: string;
  name: string;
  code: string;
  description?: string;
};

interface Brand {
  code: string;
  name: string;
}

type ImageData = {
  file: {
    fileName: string;
    url: string;
  };
};

export type FeaturedMediaData = {
  __typename: "ContentfulImage";
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
  __typename: string;
  id: string;
  title: string;
  titleAndSize: string;
  realFileName: string;
  asset: ContentfulAsset;
  assetType: ContentfulAssetType;
  noIndex?: boolean;
  BRAND?: Brand;
  description?: contentful.RichTextContent;
  featuredMedia?: FeaturedMediaData;
}

const client = contentful.createClient({
  space: process.env.SPACE_ID!,
  environment: process.env.CONTENTFUL_ENVIRONMENT!,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!
});

export const getContenfulDocuments = () =>
  client
    .getEntries({
      content_type: "document",
      locale: process.env.MARKET_LOCALE,
      // The maximum number of entries returned by the API is 1000.
      // The API will throw a BadRequestError for values higher than 1000 and values other than an integer.
      // The default number of entries returned by the API is 100.
      limit: 1000
    })
    .then((response) => response.items);

export const processContentfulDocuments = async () => {
  let documents;
  try {
    documents = await getContenfulDocuments();
    logger.info({
      message: `Received ${documents.length} contentful documents.`
    });
  } catch (error) {
    logger.error({ message: (error as Error).message });
    throw new Error((error as Error).message);
  }

  if (documents.length) {
    return transformDocuments(documents);
  }
  return [];
};

const transformDocuments = (documents: any[]): ESContentfulDocument[] => {
  const result = documents.map(
    ({
      sys,
      fields: { assetType, asset, title, noIndex, brand, featuredMedia }
    }) => {
      const { code, name, description } = assetType.fields;
      const { file } = asset.fields;

      return {
        __typename: "ContentfulDocument",
        id: sys.id,
        title: title,
        titleAndSize: `${title}_${file.details.size}`,
        realFileName: file.fileName,
        asset: {
          file: {
            ...file
          }
        },
        assetType: {
          __typename: "ContentfulAssetType",
          id: assetType.sys.id,
          code,
          name,
          ...(description && { description })
        },
        noIndex: noIndex || false,
        ...(brand && {
          BRAND: {
            name: brand,
            code: brand
          }
        }),
        ...(featuredMedia && {
          featuredMedia: {
            __typename: "ContentfulImage",
            ...extractFeatureMediaData(featuredMedia)
          }
        })
      };
    }
  );

  return result;
};
