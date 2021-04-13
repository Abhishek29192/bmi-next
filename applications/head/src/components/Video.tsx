import React from "react";
import { graphql } from "gatsby";
import YoutubeVideo from "@bmi/youtube-video";
import { Data as ImageData } from "./Image";

export type Data = {
  title: string;
  label: string;
  subtitle: string | null;
  youtubeId: string;
  previewMedia: ImageData | null;
  videoRatio: { width: number; height: number } | null;
  className: string | null;
};

const Video = ({ data }: { data: Data }) => {
  const { label, youtubeId, previewMedia, videoRatio, className } = data;

  return (
    <YoutubeVideo
      label={label}
      videoId={youtubeId}
      embedHeight={videoRatio?.height || 0}
      embedWidth={videoRatio?.width || 0}
      previewImageSource={previewMedia?.image?.resize.src || undefined}
      className={className}
    />
  );
};

export const renderVideo = (data: Data) => {
  const { label, youtubeId, previewMedia, videoRatio, className } = data;

  return (
    <YoutubeVideo
      label={label}
      videoId={youtubeId}
      embedHeight={videoRatio?.height || 0}
      embedWidth={videoRatio?.width || 0}
      previewImageSource={previewMedia?.image?.resize.src || undefined}
      className={className}
    />
  );
};

export const query = graphql`
  fragment VideoFragment on ContentfulVideo {
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
`;

export default Video;
