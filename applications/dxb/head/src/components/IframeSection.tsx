import Section from "@bmi-digital/components/section";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { graphql } from "gatsby";
import React from "react";
import { useHasOptanonBoxClosed } from "../utils/useHasOptanonBoxClosed";
import { RichTextData } from "./RichText";
import { Iframe, StyledRichText } from "./styles/IframeSectionStyles";

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
      backgroundColor="pearl"
      data-testid={`iframe-section-${replaceSpaces(data.title)}`}
    >
      {data.title && <Section.Title>{data.title}</Section.Title>}
      {data.summary && (
        <StyledRichText document={data.summary} hasNoBottomMargin />
      )}
      {hasAcceptedOptanonCookie && (
        <Iframe
          id={`iframe-section-${replaceSpaces(data.title)}-iframe`}
          key={`iframe-section-${replaceSpaces(data.title)}-iframe`}
          title={data.title || undefined}
          className={`${
            cookieClasses.length > 0 ? ` optanon-category-${cookieClasses}` : ""
          }`}
          src={data.url}
          width="100%"
          height={data.height}
          data-testid={`iframe-section-${replaceSpaces(data.title)}-iframe`}
        ></Iframe>
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
