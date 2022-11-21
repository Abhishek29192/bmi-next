import { Section } from "@bmi/components";
import { graphql } from "gatsby";
import React from "react";
import RichText, { RichTextData } from "./RichText";
import styles from "./styles/IframeSection.module.scss";

const cookieTypeToClassMap = {
  "Strictly Necessary": "C0001",
  Analytics: "C0002",
  Functional: "C0003",
  Targeting: "C0004",
  "Social Media": "C0005",
  Performance: "C0007"
};

export type Data = {
  __typename: "ContentfulIframe";
  title: string | null;
  summary: RichTextData | null;
  url: string;
  height: string;
  allowCookieClasses: string[] | null;
};
type Props = {
  data: Data;
};

const IframeSection = ({ data }: Props) => {
  const cookieClasses = (data.allowCookieClasses || [])
    // eslint-disable-next-line security/detect-object-injection
    .map((item) => cookieTypeToClassMap[item])
    .join("-");
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
        title={data.title}
        className={`${styles["iFrame"]}${
          cookieClasses.length > 0 ? ` optanon-category-${cookieClasses}` : ""
        }`}
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
    allowCookieClasses
  }
`;
