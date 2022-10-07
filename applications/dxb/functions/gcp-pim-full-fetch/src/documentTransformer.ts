import {
  AssetType as ContentfulAssetType,
  Document as ContentfulDocument,
  Image as ContentfulImage
} from "@bmi/contentful-types";
import {
  ContentfulAssetType as EsContentfulAssetType,
  ContentfulDocument as EsContentfulDocument,
  ContentfulImage as EsContentfulImage
} from "@bmi/elasticsearch-types";
import { Asset, Entry } from "contentful";

export const transformDocuments = (
  documents: Entry<ContentfulDocument>[]
): EsContentfulDocument[] =>
  documents.map((document) => ({
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
  }));

const getAsset = (asset: Asset) => ({
  file: {
    url: asset.fields.file.url,
    fileName: asset.fields.file.fileName,
    contentType: asset.fields.file.contentType,
    details: {
      size: asset.fields.file.details.size
    }
  }
});

const getAssetType = (
  assetType: Entry<ContentfulAssetType>
): EsContentfulAssetType => ({
  code: assetType.fields.code,
  name: assetType.fields.name
});

const getFeaturedMedia = (
  featuredMedia: Entry<ContentfulImage>
): EsContentfulImage => ({
  altText: featuredMedia.fields.altText,
  title: featuredMedia.fields.title,
  type: featuredMedia.fields.type,
  image: {
    file: {
      fileName: featuredMedia.fields.image.fields.file.fileName,
      url: featuredMedia.fields.image.fields.file.url
    }
  },
  focalPoint: featuredMedia.fields.focalPoint && {
    x: featuredMedia.fields.focalPoint.focalPoint.x,
    y: featuredMedia.fields.focalPoint.focalPoint.y
  }
});
