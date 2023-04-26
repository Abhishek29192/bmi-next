import { replaceSpaces, Section } from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import { useHasOptanonBoxClosed } from "../utils/useHasOptanonBoxClosed";
import RichText, { RichTextData } from "./RichText";
import styles from "./styles/IframeSection.module.scss";

type CookieTypeToClass = {
  [key: string]: string;
};

const cookieTypeToClassMap: CookieTypeToClass = {
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
  const configuredCookieClasses = (data.allowCookieClasses || [])
    // eslint-disable-next-line security/detect-object-injection
    .map((item) => cookieTypeToClassMap[item]);
  const cookieClasses = configuredCookieClasses.join("-");

  const { hasAcceptedOptanonCookie } = useHasOptanonBoxClosed(
    configuredCookieClasses
  );
  return (
    <Section
      className={styles["IframeSection"]}
      backgroundColor="pearl"
      data-testid={`iframe-section-${replaceSpaces(data.title)}`}
    >
      {data.title && (
        <Section.Title className={styles["title"]}>{data.title}</Section.Title>
      )}
      {data.summary && (
        <div className={styles["summary"]}>
          <RichText document={data.summary} hasNoBottomMargin />
        </div>
      )}
      {hasAcceptedOptanonCookie && (
        <iframe
          id={`iframe-section-${replaceSpaces(data.title)}-iframe`}
          key={`iframe-section-${replaceSpaces(data.title)}-iframe`}
          title={data.title || undefined}
          className={`${styles["iFrame"]}${
            cookieClasses.length > 0 ? ` optanon-category-${cookieClasses}` : ""
          }`}
          src={data.url}
          width="100%"
          height={data.height}
          data-testid={`iframe-section-${replaceSpaces(data.title)}-iframe`}
        />
      )}
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
