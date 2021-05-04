import React from "react";
import Hero, { HeroItem } from "@bmi/hero";
import Button from "@bmi/button";
import AlertBanner from "@bmi/alert-banner";
import { useTranslation } from "next-i18next";
import { Layout } from "../components/Layout";
import { EnrollmentItems } from "../graphql/generated/schemas";
import serverSiderProps from "../lib/serverSideProps/training";

const Training = ({ trainingData }: any) => {
  const { error, data } = trainingData;
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
    cta: {
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
    <Layout title={t("Training")}>
      <Hero level={0} hasSpaceBottom autoPlayInterval={10000} heroes={heroes} />{" "}
    </Layout>
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

export const getServerSideProps = serverSiderProps;

export default Training;
