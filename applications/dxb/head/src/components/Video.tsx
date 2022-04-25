import React, { useMemo } from "react";
import { graphql } from "gatsby";
import { YoutubeVideo } from "@bmi/components";
import { useGTM } from "../utils/google-tag-manager";
import Image, { Data as ImageData } from "./Image";

export type Data = {
  title: string;
  label: string;
  subtitle: string | null;
  youtubeId: string;
  previewMedia: ImageData | null;
  videoRatio: { width: number; height: number } | null;
};

export type ContentfulVideoData = Data & {
  __typename: "ContentfulVideo";
};

const Video = ({ data }: { data: Data }) => {
  return renderVideo(data);
};

export const renderVideo = (data: Data) => {
  const { label, subtitle, youtubeId, previewMedia, videoRatio } = data;
  const videoUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${youtubeId}`,
    [youtubeId]
  );
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
      videoId={youtubeId}
      embedHeight={videoRatio?.height || 0}
      embedWidth={videoRatio?.width || 0}
      previewImageSource={
        previewMedia ? <Image data={previewMedia} /> : undefined
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
    youtubeId
    previewMedia {
      ...ImageFragment
    }
    videoRatio {
      width
      height
    }
  }

  fragment VideoGallerySlideFragment on ContentfulVideo {
    ...VideoFragment
  }
`;

export default Video;
