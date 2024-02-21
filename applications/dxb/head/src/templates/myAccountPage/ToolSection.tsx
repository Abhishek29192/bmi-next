import Section from "@bmi-digital/components/section";
import ToolCards from "@bmi-digital/components/tool-cards";
import React from "react";
import { useSiteContext } from "../../components/Site";
import { ToolCardsBox, classes } from "./styles";
import { transformToolCard } from "./utils";
import type { ToolCardItemProps } from "@bmi-digital/components/tool-cards";

export type AllowTools = "My profile" | "Trainings" | "Roof measurement";

export type ToolSectionProps = {
  titleForToolSection: string;
  allowTools: readonly [AllowTools, ...AllowTools[]];
};

const ToolSection = ({ allowTools, titleForToolSection }: ToolSectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const transformToolCardData: [ToolCardItemProps, ...ToolCardItemProps[]] =
    transformToolCard(allowTools, getMicroCopy);

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
