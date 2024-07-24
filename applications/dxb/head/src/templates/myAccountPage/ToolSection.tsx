import Section from "@bmi-digital/components/section";
import ToolCards from "@bmi-digital/components/tool-cards";
import React, { useMemo } from "react";
import { graphql } from "gatsby";
import { useSiteContext } from "../../components/Site";
import { ToolCardsBox, classes } from "./styles";
import { transformGlobalTools, transformLocalTools } from "./utils";
import type { ToolSectionProps } from "./types";

const ToolSection = ({
  globalTools,
  tools,
  titleForToolSection,
  path
}: ToolSectionProps) => {
  const { countryCode, getMicroCopy } = useSiteContext();
  const currentPageUrl = useMemo(() => {
    const url = new URL(`${countryCode}/${path}`, process.env.GATSBY_SITE_URL);
    return url.href;
  }, [path, countryCode]);

  const transformedGlobalTools = useMemo(
    () => transformGlobalTools(currentPageUrl, globalTools, getMicroCopy),
    [currentPageUrl, globalTools, getMicroCopy]
  );

  const transformedLocalTools = useMemo(
    () => transformLocalTools(tools, countryCode),
    [tools, countryCode]
  );

  return (
    <Section backgroundColor="pearl">
      <Section.Title>{titleForToolSection}</Section.Title>
      <ToolCardsBox>
        <ToolCards
          items={[...transformedGlobalTools, ...transformedLocalTools]}
          className={classes.box}
        />
      </ToolCardsBox>
    </Section>
  );
};

export default ToolSection;

export const query = graphql`
  fragment AccountToolFragment on ContentfulAccountLink {
    title
    type
    link {
      ...LinkFragment
    }
  }
`;
