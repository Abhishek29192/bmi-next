import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../components/Layout";

const Training = () => {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("Training")}>Training page content goes here.</Layout>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "sidebar", "footer"]))
  }
});

export default Training;
