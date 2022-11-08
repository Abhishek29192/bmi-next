import { AssetType, Image } from "@bmi/contentful-types";
import { ContentfulDocument as EsContentfulDocument } from "@bmi/elasticsearch-types";
import { getContentfulClient } from "@bmi/functions-contentful-client";
import { Asset, ContentfulClientApi, Entry } from "contentful";
import { ContentfulDocument } from "./types";

const { MARKET_LOCALE } = process.env;

export const transformDocument = async (
  document: Entry<ContentfulDocument>
): Promise<EsContentfulDocument> => {
  const client = getContentfulClient();
  if (document.fields.title[MARKET_LOCALE!] === undefined) {
    throw new Error(`Locale ${MARKET_LOCALE} not found on the document.`);
  }
  const asset = await getAsset(client, document.fields.asset);
  const assetType = await getAssetType(client, document.fields.assetType);
  const featuredMedia =
    document.fields.featuredMedia &&
    (await getFeaturedMedia(client, document.fields.featuredMedia));
  const focalPoint = featuredMedia?.fields?.focalPoint?.focalPoint;
  return {
    __typename: "ContentfulDocument",
    id: document.sys.id,
    title: document.fields.title[MARKET_LOCALE!],
    titleAndSize: `${document.fields.title[MARKET_LOCALE!]} ${
      asset.fields.file.details.size
    }`,
    realFileName: asset.fields.file.fileName,
    assetType: { name: assetType.fields.name, code: assetType.fields.code },
    featuredMedia: featuredMedia && {
      altText: featuredMedia.fields.altText,
      image: {
        file: {
          fileName: featuredMedia.fields.image.fields.file.fileName,
          url: featuredMedia.fields.image.fields.file.url
        }
      },
      title: featuredMedia.fields.title,
      type: featuredMedia.fields.type,
      focalPoint: focalPoint && {
        x: focalPoint.x,
        y: focalPoint.y
      }
    },
    asset: {
      file: {
        url: asset.fields.file.url,
        fileName: asset.fields.file.fileName,
        contentType: asset.fields.file.contentType,
        details: {
          size: asset.fields.file.details.size
        }
      }
    },
    BRAND: document.fields.brand && {
      name: document.fields.brand[MARKET_LOCALE!],
      code: document.fields.brand[MARKET_LOCALE!]
    },
    noIndex: !!document.fields.noIndex
  };
};

const getAsset = async (
  client: ContentfulClientApi,
  asset: {
    [locale: string]: { sys: { type: "Link"; linkType: "Asset"; id: string } };
  }
): Promise<Asset> => {
  try {
    // eslint-disable-next-line security/detect-object-injection
    return await client.getAsset(asset[MARKET_LOCALE!].sys.id, {
      locale: MARKET_LOCALE
    });
  } catch (error) {
    throw new Error(
      `Asset ${
        asset[process.env.MARKET_LOCALE!].sys.id
      } could not be found in Contentful.`
    );
  }
};

const getAssetType = async (
  client: ContentfulClientApi,
  assetType: {
    [locale: string]: { sys: { type: "Link"; linkType: "Entry"; id: string } };
  }
): Promise<Entry<AssetType>> => {
  try {
    // eslint-disable-next-line security/detect-object-injection
    return await client.getEntry<AssetType>(assetType[MARKET_LOCALE!].sys.id, {
      locale: MARKET_LOCALE
    });
  } catch (error) {
    throw new Error(
      `Asset Type ${
        assetType[process.env.MARKET_LOCALE!].sys.id
      } could not be found in Contentful.`
    );
  }
};

const getFeaturedMedia = async (
  client: ContentfulClientApi,
  featuredMedia: {
    [locale: string]: { sys: { type: "Link"; linkType: "Entry"; id: string } };
  }
): Promise<Entry<Image>> => {
  try {
    // eslint-disable-next-line security/detect-object-injection
    return await client.getEntry<Image>(featuredMedia[MARKET_LOCALE!].sys.id, {
      locale: MARKET_LOCALE
    });
  } catch (error) {
    throw new Error(
      `Image ${
        featuredMedia[process.env.MARKET_LOCALE!].sys.id
      } could not be found in Contentful.`
    );
  }
};
