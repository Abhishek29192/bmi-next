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
import { GetPartnerBrandsQuery } from "../graphql/generated/operations";
import { getServerPageGetPartnerBrands } from "../graphql/generated/page";
import { GlobalPageProps, withPage } from "../lib/middleware/withPage";
import { Layout } from "../components/Layout";
import { SimpleCard } from "../components/Cards/SimpleCard";
import { RichText } from "../components/RichText";
import { Link } from "../components/Link";
import logger from "../lib/logger";
import { findAccountCompany, findAccountTier } from "../lib/account";
import { useAccountContext } from "../context/AccountContext";
import styles from "../styles/Homepage.module.scss";

type HomePageProps = GlobalPageProps & {
  marketContentCollection: GetPartnerBrandsQuery["marketContentCollection"];
  carouselCollection: GetPartnerBrandsQuery["carouselCollection"];
  tierBenefitCollection: GetPartnerBrandsQuery["tierBenefitCollection"];
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
  tierBenefitCollection,
  globalPageData,
  market
}: HomePageProps) => {
  const { t } = useTranslation("home-page");
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
        market.merchandisingUrl
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
                    compoent={Link}
                    href="/partner-brands"
                    footer={
                      <Button component={"span"} variant="outlined">
                        {t("partnerBrands.ctaLabel")}
                      </Button>
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

      <div className={styles.feedholder}>
        <SimpleCard>
          <Typography variant="h4" hasUnderline>
            {marketContentCollection.items[0].newsItemHeading}
          </Typography>
          <iframe
            src={marketContentCollection.items[0].newsItemUrl}
            height="400px"
            width="100%"
            frameBorder="0"
            className={styles.embed}
          />
          <Button
            variant="outlined"
            href={marketContentCollection.items[0].newsItemCta}
          >
            {t("linkedin.ctaLabel")}
          </Button>
        </SimpleCard>
        <SimpleCard>
          <Typography variant="h4" hasUnderline>
            {tierBenefitCollection.items[0].name}
          </Typography>
          <div className={styles.tierBenefits}>
            <RichText
              content={tierBenefitCollection.items[0].description.json}
            />
          </div>
        </SimpleCard>
      </div>
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

  query GetPartnerBrands($role: String!, $tier: String!) {
    # Only one relevant market content entry expected, without "limit" we hit query complexity limits
    marketContentCollection(limit: 1) {
      items {
        partnerBrandsCollection {
          items {
            name
            shortDescription
            websiteUrl
            description {
              json
            }
            image {
              ...ImageFragment
            }
            logo {
              ...ImageFragment
            }
          }
        }
        newsItemUrl
        newsItemCta
        newsItemHeading
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
    tierBenefitCollection(where: { tier: $tier }, limit: 1) {
      items {
        name
        description {
          json
        }
      }
    }
  }
`;

export const getServerSideProps = withPage(
  async ({ apolloClient, locale, account }) => {
    const {
      props: {
        data: {
          marketContentCollection,
          carouselCollection,
          tierBenefitCollection
        }
      }
    } = await getServerPageGetPartnerBrands(
      { variables: { role: account.role, tier: findAccountTier(account) } },
      apolloClient
    );

    return {
      props: {
        marketContentCollection,
        carouselCollection,
        tierBenefitCollection,
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
