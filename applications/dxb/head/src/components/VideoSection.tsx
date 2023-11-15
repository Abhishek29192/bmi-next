import Section from "@bmi-digital/components/section";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { graphql } from "gatsby";
import React from "react";
import RichText, { RichTextData } from "./RichText";
import Video, { ContentfulVideoData } from "./Video";
import { StyledVideoWrapper } from "./styles/VideoSection.styles";

export type Data = {
  __typename: "ContentfulVideoSection";
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
        <Video layout={"inline"} {...video} />
      </StyledVideoWrapper>
    </Section>
  );
};

export default VideoSection;

export const query = graphql`
  fragment VideoSectionFragment on ContentfulVideoSection {
    __typename
    name
    title
    description {
      ...RichTextFragment
    }
    video {
      ...VideoFragment
    }
  }
`;
