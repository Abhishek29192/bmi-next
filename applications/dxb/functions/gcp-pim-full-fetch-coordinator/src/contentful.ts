import contentful = require("contentful");
import logger from "@bmi-digital/functions-logger";

export type ContentfulAsset = {
  file: {
    fileName: string;
    url: string;
    details: Record<"size", number>;
    contentType: "application/pdf";
  };
};

export type ContentfulAssetType = {
  name: string;
  code: string;
  description?: string;
};

interface Brand {
  code: string;
  name: string;
}

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
}

const client = contentful.createClient({
  space: process.env.SPACE_ID!,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!
});

export const getContenfulDocuments = () =>
  client
    .getEntries({ content_type: "document", locale: process.env.LOCALE })
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
    ({ sys, fields: { assetType, asset, title, noIndex, brand } }) => {
      const { code, name } = assetType.fields;
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
          code,
          name
        },
        noIndex: noIndex || false,
        ...(brand && {
          BRAND: {
            name: brand,
            code: brand
          }
        })
      };
    }
  );

  return result;
};
