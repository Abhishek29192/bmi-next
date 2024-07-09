import YoutubeVideo from "@bmi-digital/components/youtube-video";
import { graphql } from "gatsby";
import React, { useMemo } from "react";
import { useGTM } from "../../utils/google-tag-manager";
import createImageProps from "../image/createImageProps";
import type { Data } from "./types";

const Video = ({
  label,
  subtitle,
  videoUrl,
  previewMedia,
  videoRatio,
  defaultYouTubePreviewImage,
  layout,
  ...props
}: Data) => {
  const gtm = useMemo(
    () => ({
      id: "cta-click--video-youtube",
      label: `${videoUrl}-${label}`,
      action: "Play"
    }),
    [videoUrl, label]
  );

  const { dataGTM, pushGTMEvent } = useGTM(gtm);

  return (
    <YoutubeVideo
      label={label}
      subtitle={subtitle}
      videoUrl={videoUrl}
      embedHeight={videoRatio?.height || 0}
      embedWidth={videoRatio?.width || 0}
      previewImageSource={
        previewMedia
          ? createImageProps(previewMedia)
          : defaultYouTubePreviewImage
      }
      layout={layout}
      onGTMEvent={pushGTMEvent}
      dataGTM={dataGTM}
      {...props}
    />
  );
};

export const query = graphql`
  fragment BaseVideoFragment on ContentfulVideo {
    __typename
    title
    label
    subtitle
    videoUrl: youtubeId
    videoRatio {
      width
      height
    }
    defaultYouTubePreviewImage
  }

  fragment VideoFragment on ContentfulVideo {
    ...BaseVideoFragment
    previewMedia {
      ...VideoImageFragment
    }
  }

  fragment VideoHeroFragment on ContentfulVideo {
    ...BaseVideoFragment
    previewMedia {
      ...ImageHeroFragment
    }
  }

  fragment VideoHeaderFragment on ContentfulVideo {
    ...BaseVideoFragment
    previewMedia {
      ...ImageHeaderFragment
    }
  }

  fragment VideoVillainFragment on ContentfulVideo {
    ...BaseVideoFragment
    previewMedia {
      ...ImageVillainFragment
    }
  }

  fragment VideoCardFragment on ContentfulVideo {
    ...BaseVideoFragment
    previewMedia {
      ...ImageCardFragment
    }
  }

  fragment VideoSlideFragment on ContentfulVideo {
    ...BaseVideoFragment
    previewMedia {
      ...ImageSlideFragment
    }
  }

  fragment VideoGallerySlideFragment on ContentfulVideo {
    ...BaseVideoFragment
    previewMedia {
      ...ImageGallerySlideFragment
    }
  }
`;

export default Video;