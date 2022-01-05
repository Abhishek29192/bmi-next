import React from "react";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "../../components/Layout";
import { GlobalPageProps, withPage } from "../../lib/middleware/withPage";
import ImportAccount from "../../components/Pages/ImportAccount";
import can from "../../lib/permissions/can";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../../lib/error";

type ImportAccountPageProps = GlobalPageProps & {
  globalPageData: any;
};

const ImportAccountPage = ({ globalPageData }: ImportAccountPageProps) => {
  const { t } = useTranslation();

  return (
    <Layout pageData={globalPageData} title={t("Account Import")}>
      <ImportAccount />
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({ locale, account, globalPageData, res }) => {
    const translations = await serverSideTranslations(locale, [
      "admin-account-import",
      "company-page",
      "common",
      "sidebar",
      "footer",
      "error-page"
    ]);

    if (!can(account, "navigation", "accountsAdmin")) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(
        statusCode,
        {},
        { globalPageData, ...translations }
      );
    }

    return {
      props: {
        ...translations,
        account
      }
    };
  }
);

export default withPageAuthRequired(withPageError(ImportAccountPage));
