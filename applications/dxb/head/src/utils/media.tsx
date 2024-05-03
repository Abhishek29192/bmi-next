import createVideoProps from "../components/video/createVideoProps";
import createContentfulImageProps from "../components/image/contentful-image/createContentfulImageProps";
import type { MediaData } from "@bmi-digital/components/media-gallery";
import type { Data as ImageData } from "../components/image/contentful-image/types";
import type { Data as VideoData } from "../components/video/types";
import type { ImageWidths } from "../components/image/types";

export const getJpgImage = (ogImageUrl?: string): string | undefined => {
  if (
    ogImageUrl?.includes("//images.ctfassets.net/") &&
    !ogImageUrl.includes("fm=")
  ) {
    return `${ogImageUrl}${ogImageUrl.includes("?") ? "&" : "?"}fm=jpg`;
  }
  return ogImageUrl;
};

export type GallerySectionImage = Omit<ImageData, "image"> & {
  __typename: "ContentfulImage";
  caption?: {
    caption: string;
  } | null;
  image: ImageData["image"];
};

export type GallerySectionVideo = Omit<VideoData, "previewMedia"> & {
  __typename: "ContentfulVideo";
  previewMedia: VideoData["previewMedia"] & {
    image: ImageData["image"];
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

const mediaWidths: ImageWidths = [561, 665, 785, 1285, 1392];

// TODO: DXB-7945 - provide CustomImageProps for thumbnails
export const transformMediaSrc = (
  media: readonly GallerySectionMedias[] = []
): MediaData[] => {
  return media.map((item) => {
    switch (item.__typename) {
      case "ContentfulImage":
        return {
          media: createContentfulImageProps({ ...item, widths: mediaWidths }),
          thumbnail: item.image.file.url,
          caption: item.caption?.caption || undefined,
          altText: item.altText || undefined,
          isVideo: false
        };
      case "ContentfulVideo":
        return {
          media: createVideoProps({ ...item, previewMediaWidths: mediaWidths }),
          thumbnail:
            item.previewMedia?.image.file.url ||
            item.defaultYouTubePreviewImage,
          caption: item.subtitle || undefined,
          altText: item.label,
          isVideo: true
        };
      case "PimVideo":
        return {
          media: createVideoProps({ ...item, previewMediaWidths: mediaWidths }),
          thumbnail: item.defaultYouTubePreviewImage,
          caption: item.title || undefined,
          isVideo: true
        };
    }
  });
};
