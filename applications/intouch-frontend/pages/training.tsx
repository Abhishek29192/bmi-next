import React from "react";
import Hero, { HeroItem } from "@bmi/hero";
import Button from "@bmi/button";
import AlertBanner from "@bmi/alert-banner";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryResult } from "@apollo/client";
import auth0 from "../lib/auth0";
import { Layout } from "../components/Layout";
import { EnrollmentItems } from "../graphql/generated/schemas";
import { TrainingsQuery } from "../graphql/generated/operations";
import { useTrainingsQuery } from "../graphql/generated/hooks";

const Training = () => {
  const { t } = useTranslation("training-page");
  const queryResult = useTrainingsQuery();

  return (
    <Layout title={t("Training")}>
      <TrainingDetail {...queryResult} />
    </Layout>
  );
};

const TrainingDetail = ({
  data,
  loading,
  error
}: QueryResult<TrainingsQuery>) => {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Oops... {error.message}</div>;
  const { t } = useTranslation("training-page");
  const {
    training: {
      url,
      user: { enrollment }
    }
  } = data;

  const PLACEHOLDER_IMAGE = "https://source.unsplash.com/DJ7bWa-Gwks/600x900";
  const heroes: HeroItem[] = enrollment.items.map((item) => ({
    title: item.name || "",
    children: trainingChildren(item),
    imageSource: item.image_url || PLACEHOLDER_IMAGE,
    CTA: {
      label: t("My courses"),
      action: {
        model: "htmlLink",
        href: url,
        target: "_blank",
        rel: "noopener noreferrer"
      }
    }
  }));
  return (
    <Hero level={0} hasSpaceBottom autoPlayInterval={10000} heroes={heroes} />
  );
};
const trainingChildren = ({
  description,
  type,
  status,
  url
}: EnrollmentItems) => {
  const { t } = useTranslation("training-page");
  return (
    <div>
      <p>{description}</p>
      <AlertBanner severity="warning">
        <AlertBanner.Title>Info</AlertBanner.Title>
        Type/Status : {type} / {status}
        <Button
          style={{ marginTop: "50px", marginLeft: "50px" }}
          action={{
            model: "htmlLink",
            href: url,
            target: "_blank",
            rel: "noopener noreferrer"
          }}
        >
          {t("See training")}
        </Button>
      </AlertBanner>
    </div>
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
export default Training;
