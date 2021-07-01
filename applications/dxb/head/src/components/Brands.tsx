import React, { useContext } from "react";
import { graphql, Link } from "gatsby";
import Section from "@bmi/section";
import Button, { ButtonProps } from "@bmi/button";
import BrandIntroCard from "@bmi/brand-intro-card";
import Grid from "@bmi/grid";
import { iconMap } from "@bmi/logo";
import withGTM from "../utils/google-tag-manager";

import { SiteContext } from "./Site";

export type Data = {
  title: string;
  path: string;
  subtitle: string;
  brandLogo: string;
};

const Brands = ({ data }: { data: Data[] }) => {
  const { getMicroCopy } = useContext(SiteContext);

  const GTMButton = withGTM<ButtonProps>(Button, { label: "children" });

  return (
    <Section backgroundColor={"pearl"}>
      <Section.Title> {getMicroCopy("homepage.brands")}</Section.Title>
      <Grid container justify="center">
        {data.map((brand, index) => (
          <Grid item xs={12} md={6} xl={3} key={`${brand.path}-${index}`}>
            <BrandIntroCard
              buttonComponent={(props: ButtonProps) => (
                <GTMButton
                  gtm={{
                    id: "cta-click1",
                    // @ts-ignore
                    action: props.action.to
                  }}
                  {...props}
                />
              )}
              logoIcon={iconMap[brand.brandLogo]}
              description={brand.subtitle}
              buttonLabel={getMicroCopy("homepage.brands.learn", {
                title: brand.title
              })}
              action={{
                model: "routerLink",
                to: brand.path,
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
    path
    subtitle
    brandLogo
  }
`;