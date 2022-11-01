import { gql } from "@apollo/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import {
  Button,
  Carousel,
  Hero,
  OverviewCard,
  Section,
  Typography
} from "@bmi-digital/components";
import { Account } from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useMemo, useState } from "react";
import { SimpleCard } from "../components/Cards/SimpleCard";
import { MerchandiseCTA } from "../components/Cta/Merchandise";
import { Layout } from "../components/Layout";
import { Link } from "../components/Link";
import { NewProjectDialog } from "../components/Pages/Project/CreateProject/Dialog";
import { RichText } from "../components/RichText";
import { GetPartnerBrandsQuery } from "../graphql/generated/operations";
import { getServerPageGetPartnerBrands } from "../graphql/generated/page";
import { findAccountCompany, findAccountTier } from "../lib/account";
import logger from "../lib/logger";
import { GlobalPageProps, withPage } from "../lib/middleware/withPage";
import AccessControl from "../lib/permissions/AccessControl";
import { getMarketAndEnvFromReq, parseMarketTag } from "../lib/utils";
import { getGtmData } from "../lib/utils/gtm";
import styles from "../styles/Homepage.module.scss";

export type HomePageProps = GlobalPageProps & {
  marketContent: GetPartnerBrandsQuery["marketContentCollection"]["items"][0];
  carouselItems: GetPartnerBrandsQuery["carouselCollection"]["items"][0]["listCollection"]["items"];
  tierBenefit: GetPartnerBrandsQuery["tierBenefitCollection"]["items"][0];
};

const mapPartnerBrands = (
  marketContent: GetPartnerBrandsQuery["marketContentCollection"]["items"][0]
) => {
  return (
    marketContent?.partnerBrandsCollection?.items?.map(
      ({ name, shortDescription, image, logo }) => ({
        name,
        shortDescription,
        image,
        logo
      })
    ) || []
  );
};

const getPageTitle = (account: Account) => {
  // Show user's full name or company name if they're a company member.
  return (
    findAccountCompany(account)?.name ||
    [account.firstName, account.lastName].filter(Boolean).join(" ")
  );
};

const mapHeroCarouselItems = (
  carouselItems: GetPartnerBrandsQuery["carouselCollection"]["items"][0]["listCollection"]["items"],
  getCta: (
    ctaName: string,
    {
      customUrl,
      customUrlButtonText
    }: { customUrl: string; customUrlButtonText: string }
  ) => JSX.Element
) => {
  return carouselItems.map(
    ({ header, body, image, cta, customUrl, customUrlButtonText }) => {
      return {
        title: header,
        children: body,
        media: (
          <img className={styles.carouselImage} src={image?.url} alt={header} />
        ),
        cta: getCta(cta, { customUrl, customUrlButtonText })
      };
    }
  );
};

// TODO: DRY up
const DOCEBO_SSO_URL = "/api/docebo-sso";
const MERCHANDISE_SSO_URL = "/api/merchandise-sso";

const Homepage = ({
  marketContent,
  carouselItems,
  tierBenefit,
  globalPageData,
  market,
  account
}: HomePageProps) => {
  const [newProjectDialog, setNewProjectDialog] = useState(false);

  logger({
    severity: "INFO",
    message: "Home page loaded"
  });
  const pageTitle = getPageTitle(account);
  const company = findAccountCompany(account);

  const getCta = (
    ctaName: string,
    {
      customUrl,
      customUrlButtonText
    }: { customUrl: string; customUrlButtonText: string }
  ) => {
    if (ctaName === "PROJECT") {
      return (
        <AccessControl dataModel="home" action={`CTA_${ctaName}`}>
          <ProjectCTA
            onClick={() => {
              setNewProjectDialog(true);
            }}
          />
        </AccessControl>
      );
    }
    if (ctaName === "TRAINING") {
      return (
        <AccessControl dataModel="home" action={`CTA_${ctaName}`}>
          <OtherCTA ctaName={ctaName} url={DOCEBO_SSO_URL} />
        </AccessControl>
      );
    }
    if (ctaName === "MERCHANDISE") {
      return (
        <MerchandiseCTA
          ctaName={ctaName}
          url={MERCHANDISE_SSO_URL}
          account={account}
          merchandiseSso={market.merchandiseSso}
        />
      );
    }
    if (ctaName === "CUSTOM") {
      return (
        <AccessControl dataModel="home" action={`CTA_${ctaName}`}>
          <OtherCTA
            ctaName={ctaName}
            url={customUrl}
            buttonText={customUrlButtonText}
          />
        </AccessControl>
      );
    }
    return null;
  };

  const heroItems = useMemo(
    () => mapHeroCarouselItems(carouselItems, getCta),
    [carouselItems]
  );

  return (
    <Layout title={pageTitle} pageData={globalPageData}>
      {!!heroItems.length && (
        <Hero
          level={0}
          hasSpaceBottom
          autoPlayInterval={heroItems.length > 1 ? 8000 : 0}
          heroes={heroItems}
        />
      )}
      <AccessControl dataModel="home" action="partnerBrandsCarousel">
        <PartnerBrand marketContent={marketContent} />
      </AccessControl>
      <FeedHolder marketContent={marketContent} tierBenefit={tierBenefit} />
      {company?.id && (
        <NewProjectDialog
          companyId={company.id}
          isOpen={newProjectDialog}
          onCloseClick={() => {
            setNewProjectDialog(false);
          }}
          onCompleted={() => {
            setNewProjectDialog(false);
          }}
        />
      )}
    </Layout>
  );
};

export const GET_PARTNER_BRANDS = gql`
  query GetPartnerBrands($role: String!, $tier: String!, $tag: String!) {
    # Only one relevant market content entry expected, without "limit" we hit query complexity limits
    marketContentCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
      limit: 1
    ) {
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
        newsItemClass
      }
    }
    carouselCollection(
      where: {
        audienceRole: $role
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
      limit: 1
    ) {
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
            customUrl
            customUrlButtonText
            audienceTiers
          }
        }
      }
    }
    tierBenefitCollection(
      where: {
        tier: $tier
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
      limit: 1
    ) {
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
  async ({ apolloClient, locale, account, req }) => {
    const tier = findAccountTier(account);
    const marketEnv = getMarketAndEnvFromReq(req);
    const contentfulTag = parseMarketTag(marketEnv.market);

    const {
      props: {
        data: {
          marketContentCollection,
          carouselCollection,
          tierBenefitCollection
        }
      }
    } = await getServerPageGetPartnerBrands(
      { variables: { role: account.role, tier, tag: contentfulTag } },
      apolloClient
    );
    const marketContent = marketContentCollection.items.find(Boolean);
    const carousel = carouselCollection.items.find(Boolean);
    const carouselItems = carousel
      ? carousel.listCollection.items.filter(({ audienceTiers }) =>
          audienceTiers.includes(tier)
        )
      : [];

    const tierBenefit = tierBenefitCollection.items.find(Boolean);

    return {
      props: {
        marketContent,
        carouselItems,
        tierBenefit,
        ...(await serverSideTranslations(locale, [
          "common",
          "home-page",
          "sidebar",
          "footer",
          "company-page",
          "project-page"
        ]))
      }
    };
  }
);

//TODO: Separate components to different file

const ProjectCTA = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation("home-page");
  const buttonLabel = t(`hero.cta.PROJECT`);
  const dataGtm = getGtmData("cta-click1", buttonLabel, "project");

  return (
    <Button
      hasDarkBackground
      variant="outlined"
      style={{ marginTop: "2em" }}
      onClick={onClick}
      data-testid="project-cta"
      data-gtm={dataGtm}
    >
      {buttonLabel}
    </Button>
  );
};
const OtherCTA = ({
  ctaName,
  url,
  buttonText
}: {
  ctaName: string;
  url: string;
  buttonText?: string;
}) => {
  const { t } = useTranslation("home-page");
  const buttonLabel = buttonText || t(`hero.cta.${ctaName}`);
  const dataGtm = getGtmData("cta-click1", buttonLabel, url);

  return (
    <Link data-gtm={dataGtm} href={url} isExternal={true}>
      <Button hasDarkBackground variant="outlined" style={{ marginTop: "2em" }}>
        {buttonLabel}
      </Button>
    </Link>
  );
};
const PartnerBrand = ({
  marketContent
}: {
  marketContent: GetPartnerBrandsQuery["marketContentCollection"]["items"][0];
}) => {
  const { t } = useTranslation("home-page");
  const partnerBrands = mapPartnerBrands(marketContent);

  if (!partnerBrands.length) {
    return null;
  }

  return (
    <>
      <Section backgroundColor="white" isSlim>
        <Section.Title>{t("partnerBrands.title")}</Section.Title>
        <Typography>{t("partnerBrands.description")}</Typography>
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
                href="/partner-brands"
                target="_blank"
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
  );
};
const FeedHolder = ({
  marketContent,
  tierBenefit
}: {
  marketContent: GetPartnerBrandsQuery["marketContentCollection"]["items"][0];
  tierBenefit: GetPartnerBrandsQuery["tierBenefitCollection"]["items"][0];
}) => {
  const { t } = useTranslation("home-page");
  return (
    <div className={styles.feedholder}>
      {marketContent && (
        <SimpleCard>
          <Typography variant="h4" hasUnderline>
            {marketContent.newsItemHeading}
          </Typography>
          <iframe
            // TODO: Title could be specific and more descriptive
            title={marketContent.newsItemHeading}
            src={marketContent.newsItemUrl}
            height="400px"
            width="100%"
            frameBorder="0"
            className={`${styles.embed} ${marketContent?.newsItemClass}`}
          />
          <Button
            variant="outlined"
            href={marketContent.newsItemCta}
            target="_blank"
          >
            {t("linkedin.ctaLabel")}
          </Button>
        </SimpleCard>
      )}
      {tierBenefit && (
        <SimpleCard>
          <Typography variant="h4" hasUnderline>
            {tierBenefit.name}
          </Typography>
          <div className={styles.tierBenefits}>
            <RichText content={tierBenefit.description.json} />
          </div>
        </SimpleCard>
      )}
    </div>
  );
};

export default withPageAuthRequired(Homepage);
