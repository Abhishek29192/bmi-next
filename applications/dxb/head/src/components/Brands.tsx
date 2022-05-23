import React from "react";
import { graphql, Link } from "gatsby";
import {
  logoIconMap,
  Section,
  Button,
  ButtonProps,
  BrandIntroCard,
  Grid
} from "@bmi/components";
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

  const GTMButton = withGTM<ButtonProps>(Button);

  return (
    <Section backgroundColor={"pearl"} className={styles["Brands"]}>
      <Section.Title> {getMicroCopy(microCopy.HOMEPAGE_BRANDS)}</Section.Title>
      <Grid container justify="center">
        {data.map((brand, index) => {
          const buttonLabel = getMicroCopy(microCopy.HOMEPAGE_BRANDS_LEARN, {
            title: brand.title
          });
          return (
            <Grid item xs={12} md={6} xl={3} key={`${brand.path}-${index}`}>
              <BrandIntroCard
                buttonComponent={(props: ButtonProps) => (
                  <GTMButton
                    gtm={{
                      id: "cta-click1",
                      label: `${brand.title} - ${buttonLabel}`,
                      action: props["action"]?.to
                    }}
                    {...props}
                  />
                )}
                logoIcon={logoIconMap[brand.brandLogo]}
                description={brand.subtitle}
                buttonLabel={buttonLabel}
                action={{
                  model: "routerLink",
                  to: brand.path,
                  linkComponent: Link
                }}
              />
            </Grid>
          );
        })}
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
