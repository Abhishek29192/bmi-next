import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "../components/Layout/Unauthenticated";
import EmailVerification from "../components/Pages/Authentication/email-verification";

const EmailVerificationPage = () => {
  const { t } = useTranslation("email-verification");

  return (
    <Layout title={t("title")}>
      <EmailVerification />
    </Layout>
  );
};

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "email-verification"
      ]))
    }
  };
};

export default EmailVerificationPage;
