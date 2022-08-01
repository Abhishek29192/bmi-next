import { MediaData } from "@bmi/components";
import { Data as ImageData, renderImage } from "../components/Image";
import { Data as VideoData, renderVideo } from "../components/Video";
import { getDefaultPreviewImage } from "./product-details-transforms";

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
  media: readonly GallerySectionMedias[] = []
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
          thumbnail:
            item.previewMedia?.image?.thumbnail?.src ||
            getDefaultPreviewImage(item.videoUrl),
          caption: item.subtitle || undefined,
          altText: item.previewMedia?.altText || undefined,
          isVideo: true
        };
      case "PimVideo":
        return {
          media: renderVideo(item),
          thumbnail: getDefaultPreviewImage(item.videoUrl),
          caption: item.title,
          isVideo: true
        };
    }
  });
};
