import React from "react";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { gql } from "@apollo/client";
import { TrainingCover } from "components/Cards/TrainingCover";
import { TrainingSidePanel } from "components/SidePanel/TrainingSidePanel";
import { getAuth0Instance } from "../lib/auth0";
import { initializeApollo } from "../lib/apolloClient";
import { TrainingQuery } from "../graphql/generated/operations";
import { getServerPageTraining } from "../graphql/generated/page";
import { Layout } from "../components/Layout";

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

  const { trainingContentCollection, courseCatalogues } = data;

  if (!trainingContentCollection.items.length)
    return (
      <Layout title={t("Training")}>
        <div></div>
      </Layout>
    );

  return (
    <Layout title={t("Training")}>
      <div style={{ display: "flex" }}>
        <TrainingSidePanel courseCatalog={courseCatalogues} />
        <TrainingCover trainingContentCollection={trainingContentCollection} />
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const auth0 = await getAuth0Instance(ctx.req, ctx.res);

  return auth0.withPageAuthRequired({
    async getServerSideProps({ locale, ...ctx }) {
      const apolloClient = await initializeApollo(null, { ...ctx, locale });

      const { user } = await auth0.getSession(ctx.req);

      const { AUTH0_NAMESPACE } = process.env;
      const userId = user[`${AUTH0_NAMESPACE}/intouch_docebo_id`];

      //TODO:Get default catalogue
      //We can set default catalog_id to auth0 or we can read from market table
      const catalogueId =
        user[`${AUTH0_NAMESPACE}/intouch_docebo_catalog_id`] || 345;

      let trainingData = {};

      try {
        const pageQuery = await getServerPageTraining(
          {
            variables: {
              catalogueId: catalogueId,
              userId: userId
            }
          },
          apolloClient
        );

        trainingData = pageQuery.props;
      } catch (error) {
        trainingData = {
          data: null,
          error: {
            message: error.message
          }
        };
      }

      const props = {
        trainingData,
        ...(await serverSideTranslations(locale, [
          "common",
          "sidebar",
          "footer",
          "training-page"
        ]))
      };

      return { props };
    }
  })(ctx);
};
export default withPageAuthRequired(TrainingPage);

// export doesn't matter for codegen
export const pageQuery = gql`
  query training($catalogueId: Int!, $userId: Int!) {
    trainingContentCollection {
      items {
        pageHeading
        description
        lmsCtaLabel
        image {
          url
        }
        pageSubHeading
        step1Heading
        step1SubHeading
        step1Description
        step2Heading
        step2SubHeading
        step2Description
        step3Heading
        step3SubHeading
        step3Description
        live
      }
    }
    courseCatalogues(condition: { catalogueId: $catalogueId }) {
      nodes {
        course {
          courseId
          name #
          technology #
          image
          promoted
          trainingType # category
          description
          courseEnrollments(condition: { userId: $userId }) {
            nodes {
              id
              status
              url
              courseId
            }
          }
        }
      }
    }
  }
`;
