import React from "react";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "../components/Layout";
import { SidePanel } from "../components/SidePanel";
import { withPage } from "../lib/middleware/withPage";

const Team = () => {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("Team")}>
      <SidePanel>&nbsp;</SidePanel>
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

export default withPageAuthRequired(Team);
