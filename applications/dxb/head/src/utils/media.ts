import { MediaData } from "@bmi-digital/components";
import { ContentfulImageData, renderImage } from "../components/Image";
import { Data as VideoData, renderVideo } from "../components/Video";

export const getJpgImage = (ogImageUrl: string) => {
  if (
    ogImageUrl?.includes("//images.ctfassets.net/") &&
    !ogImageUrl.includes("fm=")
  ) {
    return `${ogImageUrl}${ogImageUrl.includes("?") ? "&" : "?"}fm=jpg`;
  }
  return ogImageUrl;
};

export type GallerySectionImage = Omit<ContentfulImageData, "image"> & {
  __typename: "ContentfulImage";
  caption?: {
    caption: string;
  } | null;
  image: ContentfulImageData["image"] & {
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
          thumbnail: item.image.thumbnail.src || undefined,
          caption: item.caption?.caption || undefined,
          altText: item.altText || undefined,
          isVideo: false
        };
      case "ContentfulVideo":
        return {
          media: renderVideo(item),
          thumbnail:
            item.previewMedia?.image?.thumbnail?.src ||
            item.defaultYouTubePreviewImage,
          caption: item.subtitle || undefined,
          altText: item.label,
          isVideo: true
        };
      case "PimVideo":
        return {
          media: renderVideo(item),
          thumbnail: item.defaultYouTubePreviewImage,
          caption: item.title,
          isVideo: true
        };
    }
  });
};
