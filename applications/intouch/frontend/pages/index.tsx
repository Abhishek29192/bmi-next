import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import Hero from "@bmi/hero";
import Section from "@bmi/section";
import Typography from "@bmi/typography";
import Carousel from "@bmi/carousel";
import OverviewCard from "@bmi/overview-card";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetPartnerBrandsQuery } from "../graphql/generated/operations";
import { getServerPageGetPartnerBrands } from "../graphql/generated/page";
import { withPage } from "../lib/middleware/withPage";
import { Layout } from "../components/Layout";
import { GetGlobalDataQuery } from "../graphql/generated/operations";
import logger from "../lib/logger";
import { useAccountContext } from "../context/AccountContext";

type HomePageProps = {
  marketContentCollection: GetPartnerBrandsQuery["marketContentCollection"];
  globalPageData: GetGlobalDataQuery;
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

const Homepage = ({
  marketContentCollection,
  globalPageData
}: HomePageProps) => {
  const { t } = useTranslation("common");
  const { account } = useAccountContext();

  logger({
    severity: "INFO",
    message: "Home page loaded"
  });

  const partnerBrands = mapPartnerBrands(marketContentCollection);

  // Show user's full name or company name if they're a company member.
  const userCompany = account?.companyMembers?.nodes[0]?.company;
  const pageTitle =
    userCompany?.name ||
    [account?.firstName, account?.lastName].filter(Boolean).join(" ");

  return (
    <Layout title={pageTitle} pageData={globalPageData}>
      <Hero
        level={0}
        hasSpaceBottom
        autoPlayInterval={10000}
        heroes={[
          {
            title: "H1 First heading dark background",
            children:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus suscipit dolor nisl, nec vestibulum odio molestie tincidunt.",
            imageSource: "https://source.unsplash.com/Sc5RKXLBjGg/1200x1200",
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
            imageSource: "https://source.unsplash.com/hDOnQGPofuU/1200x1200",
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
            imageSource: "https://source.unsplash.com/dqXiw7nCb9Q/1200x1200",
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

export const getServerSideProps = withPage(
  async ({ apolloClient, locale, globalPageData, account }) => {
    const {
      props: {
        data: { marketContentCollection }
      }
    } = await getServerPageGetPartnerBrands({}, apolloClient);

    return {
      props: {
        globalPageData,
        marketContentCollection,
        account,
        ...(await serverSideTranslations(locale, [
          "common",
          "sidebar",
          "footer",
          "company-page"
        ]))
      }
    };
  }
);

export default withPageAuthRequired(Homepage);
