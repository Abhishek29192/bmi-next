import { MediaData } from "@bmi/components";
import { getDefaultPreviewImage } from "@bmi/components";
import { Data as ImageData, renderImage } from "../components/Image";
import { Data as ContenfulVideoData, renderVideo } from "../components/Video";
import { Asset, PIMVideoDataWithTypename } from "../components/types/pim";
import { getYoutubeId } from "./product-details-transforms";

const getJpgImage = (ogImageUrl: string) => {
  if (
    ogImageUrl?.includes("//images.ctfassets.net/") &&
    !ogImageUrl.includes("fm=")
  ) {
    return `${ogImageUrl}${ogImageUrl.includes("?") ? "&" : "?"}fm=jpg`;
  }
  return ogImageUrl;
};

export default getJpgImage;

type GallerySectionImage = Omit<ImageData, "image"> & {
  image: ImageData["image"] & {
    x;
    thumbnail: {
      src: string;
    };
  };
};

type GallerySectionVideo = Omit<ContenfulVideoData, "previewMedia"> & {
  previewMedia: ContenfulVideoData["previewMedia"] & {
    image: ContenfulVideoData["previewMedia"]["image"] & {
      thumbnail: {
        src: string;
      };
    };
  };
};

export type GallerySectionMedias =
  | GallerySectionImage
  | GallerySectionVideo
  | PIMVideoDataWithTypename;

export const transformMediaSrc = (
  media: GallerySectionMedias[] = []
): MediaData[] => {
  return media.map((item) => {
    switch (item.__typename) {
      case "ContentfulImage":
        return {
          media: renderImage(item),
          thumbnail: item.image.thumbnail.src || null,
          caption: item.caption?.caption || undefined,
          altText: item.altText || undefined,
          isVideo: false
        };
      case "ContentfulVideo":
        return {
          media: renderVideo(item),
          thumbnail: item.previewMedia?.image?.thumbnail?.src || null,
          caption: item.subtitle || undefined,
          altText: item.previewMedia?.altText || undefined,
          isVideo: true
        };
      case "PimVideo":
        return {
          media: renderVideo(item),
          thumbnail: getDefaultPreviewImage(getYoutubeId(item.url)),
          caption: item.name || undefined,
          isVideo: true
        };
    }
  });
};

export const filterAndTransformVideoData = (
  assets: readonly Asset[]
): PIMVideoDataWithTypename[] => {
  return (assets || [])
    .filter((el) => el.assetType === "VIDEO")
    .map((video) => {
      return {
        ...video,
        __typename: "PimVideo",
        youtubeId: getYoutubeId(video.url)
      };
    });
};
