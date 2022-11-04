import {
  BrandIntroCard,
  Button,
  ButtonProps,
  Grid,
  logoIconMap,
  Section
} from "@bmi/components";
import { graphql, Link } from "gatsby";
import React from "react";
import { microCopy } from "../constants/microCopies";
import withGTM from "../utils/google-tag-manager";
import { useSiteContext } from "./Site";
import styles from "./styles/Brands.module.scss";

export type Data = {
  title: string;
  brandLogo: string;
  path?: string;
  subtitle?: string;
};

const Brands = ({
  data,
  spaBrand = false
}: {
  data: Data[];
  spaBrand?: boolean;
}) => {
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
              {brand.path ? (
                <BrandIntroCard
                  name={brand.brandLogo}
                  buttonComponent={(props: ButtonProps) => (
                    <GTMButton
                      gtm={{
                        id: "cta-click1",
                        label: `${brand.title} - ${buttonLabel}`,
                        action: spaBrand
                          ? props["action"].href
                          : props["action"].to
                      }}
                      {...props}
                    />
                  )}
                  logoIcon={logoIconMap[brand.brandLogo]}
                  description={brand.subtitle ? brand.subtitle : undefined}
                  buttonLabel={buttonLabel}
                  action={
                    spaBrand
                      ? {
                          model: "htmlLink",
                          href: brand.path,
                          target: "_blank",
                          rel: "noopener noreferrer"
                        }
                      : {
                          model: "routerLink",
                          to: brand.path,
                          linkComponent: Link
                        }
                  }
                />
              ) : (
                <BrandIntroCard
                  name={brand.brandLogo}
                  logoIcon={logoIconMap[brand.brandLogo]}
                  description={brand.subtitle ? brand.subtitle : undefined}
                />
              )}
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
  fragment SPABrandFragment on ContentfulBrand {
    title
    path
    subtitle
    brandLogo
  }
`;
