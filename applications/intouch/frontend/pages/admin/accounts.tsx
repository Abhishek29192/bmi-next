import React from "react";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "../../components/Layout";
import { withPage } from "../../lib/middleware/withPage";
import { getServerPageProductsAndSystems } from "../../graphql/generated/page";
import ImportAccount from "../../components/Pages/ImportAccount";

const ImportAccountPage = ({ globalPageData }: any) => {
  const { t } = useTranslation();

  return (
    <Layout pageData={globalPageData} title={t("Account Import")}>
      <ImportAccount />
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({ locale, account, apolloClient }) => {
    const {
      props: { data }
    } = await getServerPageProductsAndSystems({}, apolloClient);

    return {
      props: {
        ...(await serverSideTranslations(locale, [
          "admin-account-import",
          "company-page",
          "common",
          "sidebar",
          "footer"
        ])),
        account,
        ssrProducts: data.products,
        ssrSystems: data.systems
      }
    };
  }
);

export default withPageAuthRequired(ImportAccountPage);
