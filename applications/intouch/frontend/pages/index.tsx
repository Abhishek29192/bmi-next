import React from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import Hero from "@bmi/hero";
import Section from "@bmi/section";
import Typography from "@bmi/typography";
import Carousel from "@bmi/carousel";
import OverviewCard from "@bmi/overview-card";
import Link from "next/link";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getAuth0Instance } from "../lib/auth0";
import { Layout } from "../components/Layout";
import { withLogger } from "../lib/logger/withLogger";

import { initializeApollo } from "../lib/apolloClient";
import { GetPartnerBrandsQuery } from "../graphql/generated/operations";
import { getServerPageGetPartnerBrands } from "../graphql/generated/page";

import logger from "../lib/logger";

type HomePageProps = {
  marketContentCollection: GetPartnerBrandsQuery["marketContentCollection"];
};

const mapPartnerBrands = (
  marketContentCollection: GetPartnerBrandsQuery["marketContentCollection"]
) => {
  return marketContentCollection.items[0]?.partnerBrandsCollection.items.map(
    ({ name, shortDescription, image, logo }) => ({
      name,
      shortDescription,
      image,
      logo
    })
  );
};

const Homepage = ({ marketContentCollection }: HomePageProps) => {
  const { t } = useTranslation("common");

  logger({
    severity: "INFO",
    message: "Home page loaded"
  });

  const partnerBrands = mapPartnerBrands(marketContentCollection);

  return (
    <Layout title="JS Roofers">
      <Hero
        level={0}
        hasSpaceBottom
        autoPlayInterval={10000}
        heroes={[
          {
            title: "H1 First heading dark background",
            children:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus suscipit dolor nisl, nec vestibulum odio molestie tincidunt.",
            imageSource: "https://source.unsplash.com/random/1200x1200",
            cta: (
              <Button label="Call to action button">
                Call to action button
              </Button>
            )
          },
          {
            title: "H1 Second heading dark background",
            children:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula.",
            imageSource: "https://source.unsplash.com/random/1200x1200",
            cta: (
              <Button label="Call to action button">
                Call to action button
              </Button>
            )
          },
          {
            title: "H1 Third heading dark background",
            children:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula.",
            imageSource: "https://source.unsplash.com/random/1200x1200",
            cta: (
              <Button label="Call to action button">
                Call to action button
              </Button>
            )
          }
        ]}
      />
      {partnerBrands.length > 0 ? (
        <>
          <Section backgroundColor="white" isSlim>
            <Section.Title>BMI Partner Brands</Section.Title>
            <Typography>
              BMI is pleased to offer RoofPro members special discounts and
              promotions available from our Partner Brands, including DJI, FLIR,
              Expensify, Enterprise and SIXT. These organizations provide
              members with access to complementary products and services on
              preferential terms, including drones, thermal imaging cameras,
              expenses management solutions, vehicle rental and mobility
              solutions.
            </Typography>
          </Section>
          <Section backgroundColor="alabaster" isSlim>
            <Carousel
              slidesPerPage={{
                xs: 1,
                md: 2,
                lg: 3
              }}
              scroll="finite"
              hasGutter
            >
              {partnerBrands.map((partnerBrand) => (
                <Carousel.Slide key={partnerBrand.name}>
                  <OverviewCard
                    title={partnerBrand.name}
                    media={
                      <img
                        src={partnerBrand.image.url}
                        alt={partnerBrand.image.title}
                      />
                    }
                    brandImageSource={partnerBrand.logo.url}
                    hasTitleUnderline
                    footer={
                      <Link href="/partner-brands">
                        <Button variant="outlined">{t("Read more")}</Button>
                      </Link>
                    }
                  >
                    {partnerBrand.shortDescription}
                  </OverviewCard>
                </Carousel.Slide>
              ))}
              <Carousel.Controls type="arrows" />
            </Carousel>
          </Section>
        </>
      ) : null}
    </Layout>
  );
};

export const GET_PARTNER_BRANDS = gql`
  fragment ImageFragment on Asset {
    title
    description
    contentType
    fileName
    size
    url
    width
    height
  }

  query GetPartnerBrands {
    # Only one relevant market content entry expected, without "limit" we hit query complexity limits
    marketContentCollection(limit: 1) {
      items {
        partnerBrandsCollection {
          items {
            name
            shortDescription
            image {
              ...ImageFragment
            }
            logo {
              ...ImageFragment
            }
          }
        }
      }
    }
  }
`;

export const getServerSideProps = withLogger(async (ctx) => {
  const auth0 = await getAuth0Instance(ctx.req, ctx.res);
  return auth0.withPageAuthRequired({
    async getServerSideProps(ctx) {
      const apolloClient = await initializeApollo(null, ctx);

      const {
        props: {
          data: { marketContentCollection }
        }
      } = await getServerPageGetPartnerBrands({}, apolloClient);

      return {
        props: {
          marketContentCollection,
          ...(await serverSideTranslations(ctx.locale, [
            "common",
            "sidebar",
            "footer",
            "company-page"
          ]))
        }
      };
    }
  })(ctx);
});

export default withPageAuthRequired(Homepage);
