import { getDefaultPreviewImage, MediaData } from "@bmi/components";
import { Data as ImageData, renderImage } from "../components/Image";
import { Data as VideoData, renderVideo } from "../components/Video";
import { Asset } from "../components/types/pim";
import { getYoutubeId } from "./product-details-transforms";

export const getJpgImage = (ogImageUrl: string) => {
  if (
    ogImageUrl?.includes("//images.ctfassets.net/") &&
    !ogImageUrl.includes("fm=")
  ) {
    return `${ogImageUrl}${ogImageUrl.includes("?") ? "&" : "?"}fm=jpg`;
  }
  return ogImageUrl;
};

export type GallerySectionImage = Omit<ImageData, "image"> & {
  image: ImageData["image"] & {
    thumbnail: {
      src: string;
    };
  };
};

export type GallerySectionVideo = Omit<VideoData, "previewMedia"> & {
  __typename: "ContentfulVideo";
  previewMedia: VideoData["previewMedia"] & {
    image: VideoData["previewMedia"]["image"] & {
      thumbnail: {
        src: string;
      };
    };
  };
};

export type GalleryPimVideo = Omit<VideoData, "previewMedia" | "videoRatio"> & {
  __typename: "PimVideo";
  previewMedia: null;
  videoRatio: null;
};

export type GallerySectionMedias =
  | GallerySectionImage
  | GallerySectionVideo
  | GalleryPimVideo;

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
          thumbnail: getDefaultPreviewImage(item.youtubeId),
          caption: item.title,
          isVideo: true
        };
    }
  });
};

export const filterAndTransformVideoData = (
  assets: readonly Asset[]
): GalleryPimVideo[] => {
  return (assets || [])
    .filter((el) => el.assetType === "VIDEO")
    .map((video) => {
      return {
        __typename: "PimVideo",
        title: video.name,
        label: video.name,
        subtitle: null,
        previewMedia: null,
        videoRatio: null,
        youtubeId: getYoutubeId(video.url)
      };
    });
};
