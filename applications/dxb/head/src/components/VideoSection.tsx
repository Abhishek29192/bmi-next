import Section from "@bmi-digital/components/section";
import { replaceSpaces } from "@bmi-digital/components/utils";
import YoutubeVideo from "@bmi-digital/components/youtube-video";
import React from "react";
import RichText from "./RichText";
import { StyledVideoWrapper } from "./styles/VideoSection.styles";
import type { RichTextData } from "./RichText";
import type { ContentfulVideoData } from "./video/types";

export type Data = {
  __typename: "VideoSection";
  name: string;
  title: string | null;
  description: RichTextData | null;
  video: ContentfulVideoData;
};

const VideoSection = ({
  data: { title, description, video }
}: {
  data: Data;
}) => {
  return (
    <Section data-testid={`video-section-${replaceSpaces(title)}`}>
      {title && <Section.Title>{title}</Section.Title>}
      {description && <RichText document={description} hasNoBottomMargin />}
      <StyledVideoWrapper>
        <YoutubeVideo
          {...video}
          layout="inline"
          previewImageSource={video.defaultYouTubePreviewImage}
          embedHeight={video.videoRatio?.height || 0}
          embedWidth={video.videoRatio?.width || 0}
        />
      </StyledVideoWrapper>
    </Section>
  );
};

export default VideoSection;
