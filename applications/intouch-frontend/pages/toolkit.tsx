import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import auth0 from "../lib/auth0";
import Layout from "../components/Layout";

const Toolkit = () => {
  const { t } = useTranslation("common");

  return <Layout title={t("Toolkit")}>Toolkit page content goes here.</Layout>;
};

export const getServerSideProps = auth0.withPageAuthRequired({
  async getServerSideProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          "common",
          "sidebar",
          "footer"
        ]))
      }
    };
  }
});

export default Toolkit;
