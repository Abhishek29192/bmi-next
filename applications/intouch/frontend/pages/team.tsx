import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import auth0 from "../lib/auth0";
import { Layout } from "../components/Layout";
import { SidePanel } from "../components/SidePanel";

const Team = () => {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("Team")}>
      <SidePanel>&nbsp;</SidePanel>
    </Layout>
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

export default Team;
