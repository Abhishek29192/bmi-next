import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useTranslation } from "next-i18next";
import { Section } from "@bmi/components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetPartnerBrandsQuery } from "../graphql/generated/operations";
import { findAccountTier } from "../lib/account";
import { getServerPageGetPartnerBrands } from "../graphql/generated/page";
import { GlobalPageProps, withPage } from "../lib/middleware/withPage";
import { Layout } from "../components/Layout";
import { BrandCard } from "../components/Cards/BrandCard";
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
