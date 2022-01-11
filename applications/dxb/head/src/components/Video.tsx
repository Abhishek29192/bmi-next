import React from "react";
import { graphql } from "gatsby";
import YoutubeVideo from "@bmi/youtube-video";
import Image, { Data as ImageData } from "./Image";

export type Data = {
  title: string;
  label: string;
  subtitle: string | null;
  youtubeId: string;
  previewMedia: ImageData | null;
  videoRatio: { width: number; height: number } | null;
};

const Video = ({ data }: { data: Data }) => {
  return renderVideo(data);
};

export const renderVideo = (data: Data) => {
  const { label, subtitle, youtubeId, previewMedia, videoRatio } = data;

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
