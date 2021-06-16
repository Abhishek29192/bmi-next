import React from "react";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getAuth0Instance } from "../lib/auth0";
import { Layout } from "../components/Layout";

const Toolkit = () => {
  const { t } = useTranslation("common");

  return <Layout title={t("Toolkit")}>Toolkit page content goes here.</Layout>;
};

export const getServerSideProps = async (ctx) => {
  const auth0 = await getAuth0Instance(ctx.req, ctx.res);
  return auth0.withPageAuthRequired({
    async getServerSideProps({ locale, ...ctx }) {
      return {
        props: {
          ...(await serverSideTranslations(locale, ["common"]))
        }
      };
    }
  })(ctx);
};

export default withPageAuthRequired(Toolkit);
