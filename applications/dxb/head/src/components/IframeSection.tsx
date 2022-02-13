import Section from "@bmi-digital/components/section";
import { graphql } from "gatsby";
import React from "react";
import RichText, { RichTextData } from "./RichText";
import styles from "./styles/IframeSection.module.scss";

export type Data = {
  __typename: "ContentfulIframe";
  title: string | null;
  summary: RichTextData | null;
  url: string;
  height: string;
};
type Props = {
  data: Data;
};

const IframeSection = ({ data }: Props) => {
  return (
    <Section className={styles["IframeSection"]} backgroundColor="pearl">
      {data.title && (
        <Section.Title className={styles["title"]}>{data.title}</Section.Title>
      )}
      {data.summary && (
        <div className={styles["summary"]}>
          <RichText document={data.summary} />
        </div>
      )}
      <iframe
        className={styles["iFrame"]}
        src={data.url}
        width="100%"
        height={data.height}
      ></iframe>
    </Section>
  );
};

export default IframeSection;

export const query = graphql`
  fragment IframeSectionFragment on ContentfulIframe {
    title
    summary {
      ...RichTextFragment
    }
    url
    height
  }
`;
