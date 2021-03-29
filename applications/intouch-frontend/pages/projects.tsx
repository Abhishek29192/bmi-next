import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../components/Layout";
import auth0 from "../lib/auth0";

const Projects = () => {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("Projects")}>Projects page content goes here.</Layout>
  );
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

export default Projects;
