import {
  TypeAssetType as ContentfulAssetType,
  TypeDocument as ContentfulDocument,
  TypeImage as ContentfulImage
} from "@bmi/contentful-types";
import {
  ContentfulAssetType as EsContentfulAssetType,
  ContentfulDocument as EsContentfulDocument,
  ContentfulImage as EsContentfulImage
} from "@bmi/elasticsearch-types";
import { Asset, Link } from "contentful";

export const transformDocuments = (
  documents: ContentfulDocument<undefined, string>[]
): EsContentfulDocument[] =>
  documents.map((document) => {
    if (
      !("fields" in document.fields.asset) ||
      !document.fields.asset.fields.file
    ) {
      throw new Error(`Asset not found for ${document.sys.id}`);
    }

    if (
      !document.fields.assetType ||
      !("fields" in document.fields.assetType)
    ) {
      throw new Error(`AssetType not found for ${document.sys.id}`);
    }

    return {
      __typename: "ContentfulDocument",
      id: document.sys.id,
      title: document.fields.title,
      titleAndSize: `${document.fields.title}_${document.fields.asset.fields.file.details.size}`,
      realFileName: document.fields.asset.fields.file.fileName,
      asset: getAsset(document.fields.asset),
      assetType: getAssetType(document.fields.assetType),
      noIndex: document.fields.noIndex || false,
      ...(document.fields.brand && {
        BRAND: {
          name: document.fields.brand,
          code: document.fields.brand
        }
      }),
      featuredMedia: document.fields.featuredMedia
        ? getFeaturedMedia(document.fields.featuredMedia)
        : undefined
    };
  });

const getAsset = (asset: Asset<undefined, string>) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Already checked in transformDocuments
  const file = asset.fields.file!;
  return {
    file: {
      url: file.url,
      fileName: file.fileName,
      contentType: file.contentType,
      details: {
        size: file.details.size
      }
    }
  };
};

const getAssetType = (
  assetType: ContentfulAssetType<undefined, string>
): EsContentfulAssetType => ({
  code: assetType.fields.code,
  name: assetType.fields.name
});

const getFeaturedMedia = (
  featuredMedia: ContentfulImage<undefined, string> | { sys: Link<"Entry"> }
): EsContentfulImage => {
  if (!("fields" in featuredMedia)) {
    throw new Error(`Unable to find the Image ${featuredMedia.sys.id}.`);
  }

  if (
    !("fields" in featuredMedia.fields.image) ||
    !featuredMedia.fields.image.fields.file
  ) {
    throw new Error(`${featuredMedia.sys.id} doesn't have an actual image.`);
  }
  return {
    altText: featuredMedia.fields.altText,
    title: featuredMedia.fields.title,
    type: featuredMedia.fields.type,
    image: {
      file: {
        fileName: featuredMedia.fields.image.fields.file.fileName,
        url: featuredMedia.fields.image.fields.file.url
      }
    },
    focalPoint: featuredMedia.fields.focalPoint?.focalPoint && {
      x: featuredMedia.fields.focalPoint.focalPoint.x,
      y: featuredMedia.fields.focalPoint.focalPoint.y
    }
  };
};
