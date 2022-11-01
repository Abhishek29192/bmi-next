import { Section } from "@bmi-digital/components";
import React from "react";
import { NavigationData } from "./Link";
import SitemapBlock from "./SitemapBlock";

type Props = {
  data: NavigationData;
};

const SiteMapSection = ({ data }: Props) => {
  const { label, links } = data;

  return (
    <Section>
      <Section.Title>{label}</Section.Title>
      <SitemapBlock links={links} />
    </Section>
  );
};

export default SiteMapSection;
