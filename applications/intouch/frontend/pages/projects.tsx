import React from "react";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withPage } from "../lib/middleware/withPage";
import { Layout } from "../components/Layout";

const Projects = () => {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("Projects")}>Projects page content goes here.</Layout>
  );
};

export const getServerSideProps = withPage(async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"]))
    }
  };
});

export default withPageAuthRequired(Projects);
