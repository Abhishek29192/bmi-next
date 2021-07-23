import React, { useMemo } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { Tier } from "@bmi/intouch-api-types";
import Button from "@bmi/button";
import Hero from "@bmi/hero";
import Section from "@bmi/section";
import Typography from "@bmi/typography";
import Carousel from "@bmi/carousel";
import OverviewCard from "@bmi/overview-card";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  GetPartnerBrandsQuery,
  GetGlobalDataQuery
} from "../graphql/generated/operations";
import { getServerPageGetPartnerBrands } from "../graphql/generated/page";
import { withPage } from "../lib/middleware/withPage";
import { Layout } from "../components/Layout";
import { Link } from "../components/Link";
import logger from "../lib/logger";
import { findAccountCompany, findAccountTier } from "../lib/account";
import { useAccountContext } from "../context/AccountContext";

type HomePageProps = {
  marketContentCollection: GetPartnerBrandsQuery["marketContentCollection"];
  carouselCollection: GetPartnerBrandsQuery["carouselCollection"];
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

// TODO: DRY up
const DOCEBO_SSO_URL = "/api/docebo-sso";
const HeroCarouselItemCTA = ({
  cta,
  merchandisingUrl
}: {
  cta: string;
  merchandisingUrl: string;
}) => {
  const { t } = useTranslation("home-page");

  const handledCTAs = {
    MERCHANDISE: merchandisingUrl,
    TRAINING: DOCEBO_SSO_URL,
    // TODO: Trigger new project form
    PROJECT: "/projects"
  };

  if (Object.keys(handledCTAs).includes(cta)) {
    return (
      <Link href={handledCTAs[cta]} isExternal={cta !== "PROJECT"}>
        <Button
          hasDarkBackground
          variant="outlined"
          style={{ marginTop: "2em" }}
        >
          {t(`hero.cta.${cta}`)}
        </Button>
      </Link>
    );
  }

  // NOTE: "INFO" does not have a CTA.
  return null;
};

const mapHeroCarouselItems = (
  carouselCollection: GetPartnerBrandsQuery["carouselCollection"],
  accountTier: Tier,
  merchandisingUrl: string
) => {
  return carouselCollection.items[0].listCollection.items
    .filter(({ audienceTiers }) => audienceTiers.includes(accountTier))
    .map((carouselItem) => {
      return {
        title: carouselItem.header,
        children: carouselItem.body,
        imageSource: carouselItem.image?.url,
        cta: (
          <HeroCarouselItemCTA
            cta={carouselItem.cta}
            merchandisingUrl={merchandisingUrl}
          />
        )
      };
    });
};

const Homepage = ({
  marketContentCollection,
  carouselCollection,
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
  const company = findAccountCompany(account);
  const pageTitle =
    company?.name ||
    [account?.firstName, account?.lastName].filter(Boolean).join(" ");
  // Note: Can see if a member of a company AND in T2, T3, T4
  const canSeePartnerBrandsCarousel = company && company.tier !== "T1";

  const heroItems = useMemo(
    () =>
      mapHeroCarouselItems(
        carouselCollection,
        findAccountTier(account),
        account.market.merchandisingUrl
      ),
    [carouselCollection, account]
  );

  return (
    <Layout title={pageTitle} pageData={globalPageData}>
      {/* TODO: Hero doesn't have a way to disable the controls? */}
      <Hero
        level={0}
        hasSpaceBottom
        autoPlayInterval={heroItems.length > 1 ? 5000 : 0}
        heroes={heroItems}
      />
      {canSeePartnerBrandsCarousel && partnerBrands.length > 0 ? (
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

  query GetPartnerBrands($role: String!) {
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
    carouselCollection(where: { audienceRole: $role }, limit: 1) {
      total
      items {
        audienceRole
        listCollection {
          total
          items {
            header
            image {
              title
              description
              url
            }
            body
            cta
            audienceTiers
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
        data: { marketContentCollection, carouselCollection }
      }
    } = await getServerPageGetPartnerBrands(
      { variables: { role: account.role } },
      apolloClient
    );

    return {
      props: {
        globalPageData,
        marketContentCollection,
        carouselCollection,
        account,
        ...(await serverSideTranslations(locale, [
          "common",
          "home-page",
          "sidebar",
          "footer",
          "company-page"
        ]))
      }
    };
  }
);

export default withPageAuthRequired(Homepage);
