import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Typography from "@bmi/typography";
import { Layout } from "../components/Layout/Unauthenticated";

type Props = {
  message: string;
};

const ErrorPageApi = ({ message }: Props) => {
  const { t } = useTranslation("error-page");

  return (
    <Layout title="Error">
      <div>
        <Typography component="h1" variant="h1">
          {t("title")}
        </Typography>
        <Typography variant="body1">{t(message)}</Typography>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async ({ req, locale, query }) => {
  return {
    props: {
      locale,
      message: query.message,
      ...(await serverSideTranslations(locale, ["error-page"]))
    }
  };
};

export default ErrorPageApi;
