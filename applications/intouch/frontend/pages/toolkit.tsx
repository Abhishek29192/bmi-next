import React from "react";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "../components/Layout";
import { withPage } from "../lib/middleware/withPage";
import { GetGlobalDataQuery } from "../graphql/generated/operations";

type ToolkitPageProps = {
  globalPageData: GetGlobalDataQuery;
};

const Toolkit = ({ globalPageData }: ToolkitPageProps) => {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("Media Tools")} pageData={globalPageData}>
      Toolkit page content goes here.
    </Layout>
  );
};

export const getServerSideProps = withPage(async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"]))
    }
  };
});

export default withPageAuthRequired(Toolkit);
