import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Section } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { BrandCard } from "../components/Cards/BrandCard";
import { Layout } from "../components/Layout";
import { GetPartnerBrandsQuery } from "../graphql/generated/operations";
import { getServerPageGetPartnerBrands } from "../graphql/generated/page";
import { findAccountTier } from "../lib/account";
import { GlobalPageProps, withPage } from "../lib/middleware/withPage";
import { getMarketAndEnvFromReq, parseMarketTag } from "../lib/utils";

type PartnerBrandPageProps = GlobalPageProps & {
  marketContentCollection: GetPartnerBrandsQuery["marketContentCollection"];
};

const mapPartnerBrands = (
  marketContentCollection: GetPartnerBrandsQuery["marketContentCollection"]
) => {
  return marketContentCollection.items[0]?.partnerBrandsCollection.items.map(
    ({ name, shortDescription, description, image, logo, websiteUrl }) => ({
      name,
      shortDescription,
      description,
      image,
      logo,
      websiteUrl
    })
  );
};

const PartnerBrandPage = ({
  marketContentCollection,
  globalPageData
}: PartnerBrandPageProps) => {
  const { t } = useTranslation("common");
  const partnerBrands = mapPartnerBrands(marketContentCollection);

  return (
    <Layout title={t("Partner Brands")} pageData={globalPageData}>
      {partnerBrands.length > 0 ? (
        <>
          <Section backgroundColor="alabaster" isSlim>
            {partnerBrands.map((partnerBrand) => (
              <BrandCard
                id={partnerBrand.name.replace(/\s+/g, "-").toLowerCase()}
                key={partnerBrand.name}
                title={partnerBrand.name}
                bannerImage={partnerBrand.image.url}
                logo={partnerBrand.logo.url}
                link={partnerBrand.websiteUrl}
                description={partnerBrand.description.json}
              />
            ))}
          </Section>
        </>
      ) : null}
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({ apolloClient, locale, account, req }) => {
    const marketEnv = getMarketAndEnvFromReq(req);
    const contentfulTag = parseMarketTag(marketEnv.market);
    const {
      props: {
        data: { marketContentCollection }
      }
    } = await getServerPageGetPartnerBrands(
      {
        variables: {
          role: account.role,
          tier: findAccountTier(account),
          tag: contentfulTag
        }
      },
      apolloClient
    );

    return {
      props: {
        marketContentCollection,
        ...(await serverSideTranslations(locale, [
          "common",
          "sidebar",
          "footer"
        ]))
      }
    };
  }
);

export default withPageAuthRequired(PartnerBrandPage);
