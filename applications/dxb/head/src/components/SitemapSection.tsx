import Section from "@bmi-digital/components/section";
import React from "react";
import { NavigationData } from "./Link";
import SitemapBlock from "./SitemapBlock";

type Props = {
  data: NavigationData;
};

const SiteMapSection = ({ data }: Props) => {
  const { label, links } = data;

  return (
    <Section id="site-map" data-testid="sitemap-section">
      <Section.Title>{label}</Section.Title>
      <SitemapBlock links={links} />
    </Section>
  );
};

export default SiteMapSection;
