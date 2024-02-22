import Section from "@bmi-digital/components/section";
import ToolCards from "@bmi-digital/components/tool-cards";
import React, { useMemo } from "react";
import { useSiteContext } from "../../components/Site";
import { ToolCardsBox, classes } from "./styles";
import { transformToolCard } from "./utils";
import type { ToolCardItemProps } from "@bmi-digital/components/tool-cards";

export type AllowTools = "My profile" | "Trainings" | "Roof measurement";

export type ToolSectionProps = {
  titleForToolSection: string;
  allowTools: readonly [AllowTools, ...AllowTools[]];
  path: string;
};

const ToolSection = ({
  allowTools,
  titleForToolSection,
  path
}: ToolSectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const currentPageUrl = useMemo(() => {
    const url = new URL(path, process.env.GATSBY_SITE_URL);
    return url.href;
  }, [path]);

  const transformToolCardData: [ToolCardItemProps, ...ToolCardItemProps[]] =
    transformToolCard(currentPageUrl, allowTools, getMicroCopy);

  return (
    <Section backgroundColor="pearl">
      <Section.Title>{titleForToolSection}</Section.Title>
      <ToolCardsBox>
        <ToolCards items={transformToolCardData} className={classes.box} />
      </ToolCardsBox>
    </Section>
  );
};

export default ToolSection;
