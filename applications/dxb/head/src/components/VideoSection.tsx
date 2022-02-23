import { Section } from "@bmi/components";
import { graphql } from "gatsby";
import React from "react";
import RichText, { RichTextData } from "./RichText";
import styles from "./styles/VideoSection.module.scss";
import { Data as VideoData, renderVideo } from "./Video";

export type Data = {
  __typename: "ContentfulVideoSection";
  name: string;
  title: string | null;
  description: RichTextData | null;
  video: VideoData;
};

const VideoSection = ({
  data: { title, description, video }
}: {
  data: Data;
}) => {
  const videoNode = React.cloneElement(renderVideo(video), {
    layout: "inline"
  });

  return (
    <Section className={styles["VideoSection"]}>
      {title && (
        <Section.Title className={styles["heading"]}>{title}</Section.Title>
      )}
      <RichText document={description} />
      <div className={styles["video"]}>{videoNode}</div>
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
