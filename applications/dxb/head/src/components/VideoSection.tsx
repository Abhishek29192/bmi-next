import { replaceSpaces, Section } from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import RichText, { RichTextData } from "./RichText";
import styles from "./styles/VideoSection.module.scss";
import Video, { ContentfulVideoData } from "./Video";

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
    <Section
      className={styles["VideoSection"]}
      data-testid={`video-section-${replaceSpaces(title)}`}
    >
      {title && (
        <Section.Title className={styles["heading"]}>{title}</Section.Title>
      )}
      {description && <RichText document={description} hasNoBottomMargin />}
      <div className={styles["video"]}>
        <Video layout={"inline"} {...video} />
      </div>
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
