import { ContentfulDocument as EsContentfulDocument } from "@bmi/elasticsearch-types";
import { getContentfulClient } from "@bmi/functions-contentful-client";
import { Asset, AssetFile, ContentfulClientApi } from "contentful";
import type {
  TypeAssetType as AssetType,
  TypeImage as Image,
  TypeAssetTypeSkeleton,
  TypeImage,
  TypeImageSkeleton
} from "@bmi/contentful-types";
import { ContentfulDocument } from "./types";

const { MARKET_LOCALE } = process.env;

export const transformDocument = async (
  document: ContentfulDocument
): Promise<EsContentfulDocument> => {
  const client = getContentfulClient();
  const asset = await getAsset(client, document.fields.asset);
  const file = getFile(asset);
  const assetType = await getAssetType(client, document.fields.assetType);
  const featuredMedia =
    document.fields.featuredMedia &&
    (await getFeaturedMedia(client, document.fields.featuredMedia));
  const focalPoint = featuredMedia?.fields?.focalPoint?.focalPoint;
  const title = getTitle(document.fields.title);
  return {
    __typename: "ContentfulDocument",
    id: document.sys.id,
    title,
    titleAndSize: `${title} ${file.details.size}`,
    realFileName: file.fileName,
    assetType: { name: assetType.fields.name, code: assetType.fields.code },
    featuredMedia: featuredMedia && {
      altText: featuredMedia.fields.altText,
      image: {
        file: getFeaturedMediaFile(featuredMedia)
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
        url: file.url,
        fileName: file.fileName,
        contentType: file.contentType,
        details: {
          size: file.details.size
        }
      }
    },
    BRAND: getBrand(document.fields.brand),
    noIndex: document.fields.noIndex
      ? getnoIndex(document.fields.noIndex)
      : !!document.fields.noIndex
  };
};

const getnoIndex = (
  noIndex: ContentfulDocument["fields"]["noIndex"]
): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Enforced to exist in checkEnvVariablesMissing
  const actualNoIndex = noIndex && noIndex[MARKET_LOCALE!];
  if (!actualNoIndex) {
    return false;
  }

  return actualNoIndex;
};

const getTitle = (title: ContentfulDocument["fields"]["title"]): string => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Enforced to exist in checkEnvVariablesMissing
  const actualTitle = title[MARKET_LOCALE!];
  if (!actualTitle) {
    throw new Error(`Title was not populated for locale ${MARKET_LOCALE}.`);
  }

  return actualTitle;
};

const getFile = (asset: Asset<undefined, string>): AssetFile => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Enforced to exist in checkEnvVariablesMissing
  const actualAsset = asset.fields.file;
  if (!actualAsset) {
    throw new Error(`Asset file was not present for ${asset.sys.id}.`);
  }

  return actualAsset;
};

const getFeaturedMediaFile = (featuredMedia: TypeImage<undefined, string>) => {
  if (
    !("fields" in featuredMedia.fields.image) ||
    !featuredMedia.fields.image.fields.file
  ) {
    throw new Error(`Unable to find an image for ${featuredMedia.sys.id}.`);
  }

  return {
    fileName: featuredMedia.fields.image.fields.file.fileName,
    url: featuredMedia.fields.image.fields.file.url
  };
};

const getAsset = async (
  client: ContentfulClientApi<undefined>,
  // assetLink: Record<string, { sys: Link<"Asset"> } | undefined>
  assetLink: ContentfulDocument["fields"]["asset"]
): Promise<Asset<undefined, string>> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Enforced to exist in checkEnvVariablesMissing
  const localisedAssetLink = assetLink[MARKET_LOCALE!];
  if (!localisedAssetLink) {
    throw new Error(
      `Could not find an asset link for locale ${MARKET_LOCALE}.`
    );
  }

  try {
    return await client.getAsset(localisedAssetLink.sys.id, {
      locale: MARKET_LOCALE
    });
  } catch (error) {
    throw new Error(
      `Asset ${localisedAssetLink.sys.id} could not be found in Contentful.`
    );
  }
};

const getAssetType = async (
  client: ContentfulClientApi<undefined>,
  assetTypeLink: ContentfulDocument["fields"]["assetType"]
): Promise<AssetType<undefined, string>> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Enforced to exist in checkEnvVariablesMissing
  const localisedAssetTypeLink = assetTypeLink[MARKET_LOCALE!];
  if (!localisedAssetTypeLink) {
    throw new Error(
      `Could not find an asset type link for locale ${MARKET_LOCALE}.`
    );
  }

  try {
    return await client.getEntry<TypeAssetTypeSkeleton>(
      localisedAssetTypeLink.sys.id,
      {
        locale: MARKET_LOCALE
      }
    );
  } catch (error) {
    throw new Error(
      `Asset Type ${localisedAssetTypeLink.sys.id} could not be found in Contentful.`
    );
  }
};

const getFeaturedMedia = async (
  client: ContentfulClientApi<undefined>,
  featuredMediaLink: NonNullable<ContentfulDocument["fields"]["featuredMedia"]>
): Promise<Image<undefined, string>> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Enforced to exist in checkEnvVariablesMissing
  const localisedFeatureMediaLink = featuredMediaLink[MARKET_LOCALE!];
  if (!localisedFeatureMediaLink) {
    throw new Error(
      `Could not find a featured media link for locale ${MARKET_LOCALE}`
    );
  }

  try {
    // eslint-disable-next-line security/detect-object-injection
    return await client.getEntry<TypeImageSkeleton>(
      localisedFeatureMediaLink.sys.id,
      {
        locale: MARKET_LOCALE
      }
    );
  } catch (error) {
    throw new Error(
      `Image ${localisedFeatureMediaLink.sys.id} could not be found in Contentful.`
    );
  }
};

const getBrand = (
  brand: ContentfulDocument["fields"]["brand"]
): EsContentfulDocument["BRAND"] | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Enforced to exist in checkEnvVariablesMissing
  const actualBrand = brand?.[MARKET_LOCALE!];
  if (brand && !actualBrand) {
    throw new Error(`Brand was not populated for locale ${MARKET_LOCALE}.`);
  }

  if (!actualBrand) {
    return undefined;
  }

  return { name: actualBrand, code: actualBrand };
};
