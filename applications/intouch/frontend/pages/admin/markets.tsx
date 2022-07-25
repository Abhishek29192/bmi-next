import React from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "../../components/Layout";
import { GlobalPageProps, withPage } from "../../lib/middleware/withPage";
import { getServerPageMarkets } from "../../graphql/generated/page";
import { MarketsQuery } from "../../graphql/generated/operations";
import MarketsView from "../../components/Pages/Markets";
import can from "../../lib/permissions/can";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../../lib/error";

type MarketsPageProps = GlobalPageProps & {
  markets: MarketsQuery["markets"];
  doceboTiers: MarketsQuery["doceboTiers"];
  globalPageData: any;
};

const MarketsPage = ({
  globalPageData,
  markets,
  doceboTiers
}: MarketsPageProps) => {
  const { t } = useTranslation();

  return (
    <Layout pageData={globalPageData} title={t("Markets")}>
      <MarketsView markets={markets} doceboTiers={doceboTiers} />
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({ locale, account, apolloClient, globalPageData, res }) => {
    const translations = await serverSideTranslations(locale, [
      "admin-markets",
      "common",
      "sidebar",
      "footer",
      "error-page"
    ]);

    if (!can(account, "navigation", "marketsAdmin")) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(
        statusCode,
        {},
        { globalPageData, ...translations }
      );
    }

    const {
      props: { data }
    } = await getServerPageMarkets({}, apolloClient);

    return {
      props: {
        ...translations,
        account,
        markets: data.markets,
        doceboTiers: data.doceboTiers
      }
    };
  }
);

export const markets = gql`
  query markets {
    markets {
      nodes {
        id
        language
        domain
        cmsSpaceId
        name
        sendName
        sendMailbox
        doceboInstallersBranchId
        doceboCompanyAdminBranchId
        merchandisingUrl
        projectsEnabled
        gtag
        gtagMarketMedia
        locationBiasRadiusKm
      }
    }
    doceboTiers {
      nodes {
        id
        marketId
        tierCode
        doceboCatalogueId
      }
    }
  }
`;

export default withPageAuthRequired(withPageError(MarketsPage));
