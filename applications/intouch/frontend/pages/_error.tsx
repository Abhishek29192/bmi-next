import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Typography from "@bmi-digital/components/typography";
import { Layout } from "../components/Layout/Unauthenticated";

const ErrorPage = ({ err, locale, ...props }: any) => {
  // For some reason useTranslation is not working
  const translations =
    props?._nextI18Next?.initialI18nStore?.[`${locale}`]?.["error-page"];

  return (
    <Layout title="Error">
      <div>
        <Typography component="h1" variant="h1">
          {translations?.title}
        </Typography>
        <Typography variant="body1">{translations?.body}</Typography>
      </div>
    </Layout>
  );
};

export const getStaticProps = async ({ res, err, locale }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return {
    props: {
      statusCode,
      locale,
      ...(await serverSideTranslations(locale, ["error-page"]))
    }
  };
};

export default ErrorPage;
