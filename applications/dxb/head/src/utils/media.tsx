import { MediaData } from "@bmi-digital/components";
import React from "react";
import Image, { Data as ImageData } from "../components/Image";
import Video, { Data as VideoData } from "../components/Video";

export const getJpgImage = (ogImageUrl?: string) => {
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
    image: VideoData["previewMedia"]["image"];
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
          media: <Image {...item} />,
          thumbnail: item.image.thumbnail?.images.fallback?.src,
          caption: item.caption?.caption || undefined,
          altText: item.altText || undefined,
          isVideo: false
        };
      case "ContentfulVideo":
        return {
          media: <Video {...item} />,
          thumbnail:
            item.previewMedia?.image?.thumbnail?.images.fallback.src ||
            item.defaultYouTubePreviewImage,
          caption: item.subtitle || undefined,
          altText: item.label,
          isVideo: true
        };
      case "PimVideo":
        return {
          media: <Video {...item} />,
          thumbnail: item.defaultYouTubePreviewImage,
          caption: item.title,
          isVideo: true
        };
    }
  });
};
