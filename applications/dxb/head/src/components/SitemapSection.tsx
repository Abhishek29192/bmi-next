import React from "react";
import Section from "@bmi-digital/components/section";
import SitemapBlock from "./SitemapBlock";
import { NavigationData } from "./Link";

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
