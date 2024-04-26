import BrandIntroCard from "@bmi-digital/components/brand-intro-card";
import Grid from "@bmi-digital/components/grid";
import Section from "@bmi-digital/components/section";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { microCopy } from "@bmi/microcopies";
import { graphql, Link } from "gatsby";
import React from "react";
import BrandLogo, { Logo } from "./BrandLogo";
import { useSiteContext } from "./Site";
import { SectionElement } from "./styles/BrandsStyles";

export type Data = {
  title: string;
  brandLogo: Logo;
  path: string;
  subtitle?: string;
};

const Brands = ({ data }: { data: Data[] }) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <SectionElement backgroundColor="pearl" data-testid="brands">
      <Section.Title> {getMicroCopy(microCopy.HOMEPAGE_BRANDS)}</Section.Title>
      <Grid container justifyContent="center">
        {data.map((brand, index) => {
          const buttonLabel = getMicroCopy(microCopy.HOMEPAGE_BRANDS_LEARN, {
            title: brand.title
          });
          return (
            <Grid xs={12} md={6} xl={3} key={`${brand.path}-${index}`}>
              <BrandIntroCard
                name={brand.brandLogo}
                logoIcon={<BrandLogo brandName={brand.brandLogo} />}
                subtitle={brand.subtitle}
                ctaLabel={buttonLabel}
                component={Link}
                to={brand.path}
                gtm={{
                  id: "cta-click1",
                  label: `${brand.title} - ${buttonLabel}`,
                  action: brand.path
                }}
                data-testid={`brand-intro-card-${replaceSpaces(brand.title)}`}
              />
            </Grid>
          );
        })}
      </Grid>
    </SectionElement>
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
