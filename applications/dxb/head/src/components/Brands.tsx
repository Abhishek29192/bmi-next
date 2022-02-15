import React from "react";
import { graphql, Link } from "gatsby";
import { Section } from "@bmi-digital/components";
import { Button, ButtonProps } from "@bmi-digital/components";
import { BrandIntroCard } from "@bmi-digital/components";
import { Grid } from "@bmi-digital/components";
import { logoIconMap } from "@bmi-digital/components";
import { microCopy } from "../constants/microCopies";
import withGTM from "../utils/google-tag-manager";
import styles from "./styles/Brands.module.scss";

import { useSiteContext } from "./Site";

export type Data = {
  title: string;
  path: string;
  subtitle: string;
  brandLogo: string;
};

const Brands = ({ data }: { data: Data[] }) => {
  const { getMicroCopy } = useSiteContext();

  const GTMButton = withGTM<ButtonProps>(Button, { label: "children" });

  return (
    <Section backgroundColor={"pearl"} className={styles["Brands"]}>
      <Section.Title> {getMicroCopy(microCopy.HOMEPAGE_BRANDS)}</Section.Title>
      <Grid container justifyContent="center">
        {data.map((brand, index) => (
          <Grid item xs={12} md={6} xl={3} key={`${brand.path}-${index}`}>
            <BrandIntroCard
              buttonComponent={(props: ButtonProps) => (
                <GTMButton
                  gtm={{
                    id: "cta-click1",
                    action: props["action"]?.to
                  }}
                  {...props}
                />
              )}
              logoIcon={logoIconMap[brand.brandLogo]}
              description={brand.subtitle}
              buttonLabel={getMicroCopy(microCopy.HOMEPAGE_BRANDS_LEARN, {
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
