import {
  BrandIntroCard,
  Button,
  ButtonProps,
  Grid,
  Section
} from "@bmi-digital/components";
import { graphql, Link } from "gatsby";
import React from "react";
import { microCopy } from "../constants/microCopies";
import withGTM from "../utils/google-tag-manager";
import BrandLogo, { Logo } from "./BrandLogo";
import { useSiteContext } from "./Site";
import styles from "./styles/Brands.module.scss";

export type Data = {
  title: string;
  brandLogo: Logo;
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
    <Section
      backgroundColor={"pearl"}
      className={styles["Brands"]}
      data-testid="brands"
    >
      <Section.Title> {getMicroCopy(microCopy.HOMEPAGE_BRANDS)}</Section.Title>
      <Grid container justifyContent="center">
        {data.map((brand, index) => {
          const buttonLabel = getMicroCopy(microCopy.HOMEPAGE_BRANDS_LEARN, {
            title: brand.title
          });
          return (
            <Grid xs={12} md={6} xl={3} key={`${brand.path}-${index}`}>
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
                  logoIcon={<BrandLogo brandName={brand.brandLogo} />}
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
                  data-testid={`brand-intro-card-${brand.title.replace(
                    / /g,
                    "-"
                  )}`}
                />
              ) : (
                <BrandIntroCard
                  name={brand.brandLogo}
                  logoIcon={<BrandLogo brandName={brand.brandLogo} />}
                  description={brand.subtitle ? brand.subtitle : undefined}
                  data-testid={`brand-intro-card-${brand.title.replace(
                    / /g,
                    "-"
                  )}`}
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
