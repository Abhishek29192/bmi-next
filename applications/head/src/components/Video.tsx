import React from "react";
import { graphql } from "gatsby";
import YoutubeVideo from "@bmi/youtube-video";

export type Data = {
  title: string;
  label: string;
  subtitle: string | null;
  youtubeId: string;
  previewImage: {
    resize: {
      src: string;
    };
    file: {
      fileName: string;
      url: string;
    };
  } | null;
  videoRatio: { width: number; height: number } | null;
  className: string | null;
};

const Video = ({ data }: { data: Data }) => {
  const { label, youtubeId, previewImage, videoRatio, className } = data;

  return (
    <YoutubeVideo
      label={label}
      videoId={youtubeId}
      embedHeight={videoRatio?.height || 0}
      embedWidth={videoRatio?.width || 0}
      previewImageSource={previewImage?.resize.src || undefined}
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
    previewImage {
      title
      resize(width: 1000, toFormat: JPG, jpegProgressive: true, quality: 60) {
        src
      }
      file {
        fileName
        url
      }
    }
    videoRatio {
      width
      height
    }
  }
`;

export default Video;
