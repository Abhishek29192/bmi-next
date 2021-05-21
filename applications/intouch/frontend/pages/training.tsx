import React from "react";
import Hero, { HeroItem } from "@bmi/hero";
import Button from "@bmi/button";
import AlertBanner from "@bmi/alert-banner";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { gql } from "@apollo/client";
import type { EnrollmentItems } from "@bmi/intouch-api-types";
import { getAuth0Instance } from "../lib/auth0";
import { initializeApollo } from "../lib/apolloClient";
import { TrainingQuery } from "../graphql/generated/operations";
import { getServerPageTraining } from "../graphql/generated/page";
import { Layout } from "../components/Layout";

// export doesn't matter for codegen
export const pageQuery = gql`
  query trainingInformation {
    courses {
      nodes {
        id
        name
        technology
        image
        promoted
        trainingType
        description
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
    courseEnrollments {
      nodes {
        id
        url
        status

        course {
          id
          name
          description
          image
          technology
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

type PageProps = {
  trainingData: {
    data: TrainingQuery;
    error?: {
      message: string;
    };
  };
};

const TrainingPage = ({ trainingData }: PageProps) => {
  const { t } = useTranslation("training-page");
  const { error, data } = trainingData;

  if (error)
    return (
      <Layout title={t("Training")}>
        <div>Oops... {error.message}</div>
      </Layout>
    );

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

export const getServerSideProps = async (ctx) => {
  const auth0 = await getAuth0Instance(ctx.req, ctx.res);
  return auth0.withPageAuthRequired({
    async getServerSideProps({ locale, ...ctx }) {
      const apolloClient = await initializeApollo(null, ctx);

      let trainingData = {};

      try {
        const pageQuery = await getServerPageTraining({}, apolloClient);
        trainingData = pageQuery.props;
      } catch (error) {
        trainingData = {
          data: null,
          error: {
            message: error.message
          }
        };
      }

      return {
        props: {
          trainingData,
          ...(await serverSideTranslations(locale, [
            "common",
            "sidebar",
            "footer",
            "company-page"
          ]))
        }
      };
    }
  })(ctx);
};

export default TrainingPage;
