import React, { useContext } from "react";
import { graphql, Link } from "gatsby";
import Section from "@bmi/section";
import BrandIntroCard from "@bmi/brand-intro-card";
import Grid from "@bmi/grid";
import { iconMap } from "@bmi/logo";

import { SiteContext } from "./Site";

export type Data = {
  title: string;
  slug: string;
  subtitle: string;
  brandLogo: string;
};

const Brands = ({ data }: { data: Data[] }) => {
  const { getMicroCopy } = useContext(SiteContext);

  return (
    <Section backgroundColor={"pearl"}>
      <Section.Title> {getMicroCopy("homepage.brands")}</Section.Title>
      <Grid container spacing={2} justify="center">
        {data.map((brand, index) => (
          <Grid item xs={12} md={6} xl={4} key={`${brand.slug}-${index}`}>
            <BrandIntroCard
              logoIcon={iconMap[brand.brandLogo]}
              description={brand.subtitle}
              buttonLabel={getMicroCopy("homepage.brands.learn").replace(
                "{{title}}",
                brand.title
              )}
              action={{
                model: "routerLink",
                to: brand.slug,
                linkComponent: Link
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Section>
  );
};

export default Brands;

export const query = graphql`
  fragment BrandFragment on ContentfulBrandLandingPage {
    title
    slug
    subtitle
    brandLogo
  }
`;
