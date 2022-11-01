import { YoutubeVideo } from "@bmi-digital/components";
import { graphql } from "gatsby";
import React, { useMemo } from "react";
import { useGTM } from "../utils/google-tag-manager";
import Image, { Data as ImageData } from "./Image";

export type Data = {
  title: string;
  label: string;
  subtitle: string | null;
  videoUrl: string;
  previewMedia: ImageData | null;
  videoRatio: { width: number; height: number } | null;
  defaultYouTubePreviewImage: string;
};

export type ContentfulVideoData = Data & {
  __typename: "ContentfulVideo";
};

const Video = ({ data }: { data: Data }) => {
  return renderVideo(data);
};

export const renderVideo = (data: Data) => {
  const {
    label,
    subtitle,
    videoUrl,
    previewMedia,
    videoRatio,
    defaultYouTubePreviewImage
  } = data;

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
        previewMedia ? (
          <Image data={previewMedia} />
        ) : (
          defaultYouTubePreviewImage
        )
      }
      onGTMEvent={pushGTMEvent}
      dataGTM={dataGTM}
    />
  );
};

export const query = graphql`
  fragment VideoFragment on ContentfulVideo {
    __typename
    title
    label
    subtitle
    videoUrl: youtubeId
    previewMedia {
      ...ImageFragment
    }
    videoRatio {
      width
      height
    }
    defaultYouTubePreviewImage
  }

  fragment VideoGallerySlideFragment on ContentfulVideo {
    ...VideoFragment
  }
`;

export default Video;
