import React, { useState } from "react";
import { Course } from "@bmi/intouch-api-types";
import Grid from "@bmi/grid";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { gql } from "@apollo/client";
import { TrainingCover } from "../components/Cards/TrainingCover";
import { TrainingSidePanel } from "../components/SidePanel/TrainingSidePanel";
import GridStyles from "../styles/Grid.module.scss";
import {
  TrainingQuery,
  GetGlobalDataQuery
} from "../graphql/generated/operations";
import { withPage } from "../lib/middleware/withPage";
import {
  getServerPageDoceboCatalogIdByMarketDomain,
  getServerPageTraining
} from "../graphql/generated/page";
import { Layout } from "../components/Layout";
import { TrainingCourseDetail } from "../components/Cards/TrainingCourseDetail";

type PageProps = {
  trainingData: {
    data: TrainingQuery;
    error?: {
      message: string;
    };
  };
  globalPageData: GetGlobalDataQuery;
};

const DOCEBO_SSO_URL = "/api/docebo-sso";

const TrainingPage = ({ trainingData, globalPageData }: PageProps) => {
  const { t } = useTranslation("training-page");
  const { error, data } = trainingData;

  const [activeCourse, setActiveCourse] = useState<Course>(null);

  if (error)
    return (
      <Layout title={t("Training")} pageData={globalPageData}>
        <div>Oops... {error.message}</div>
      </Layout>
    );

  const { trainingContentCollection, courseCatalogues } = data;

  if (!trainingContentCollection.items.length)
    return (
      <Layout title={t("Training")} pageData={globalPageData}>
        <div></div>
      </Layout>
    );

  const sidePanelHandler = (courseId: number) => {
    const activeCourse = courseCatalogues.nodes.find(
      ({ course }) => course.courseId === courseId
    )?.course as Course;
    setActiveCourse(activeCourse);
  };

  //Translate course status
  courseCatalogues?.nodes?.forEach(({ course }) => {
    course.courseEnrollments?.nodes.forEach(
      (enrollment) => (enrollment.status = t(enrollment.status))
    );
  });

  return (
    <Layout title={t("Training")} pageData={globalPageData}>
      <div style={{ display: "flex" }}>
        <TrainingSidePanel
          courseCatalog={courseCatalogues}
          onCourseSelected={sidePanelHandler}
          onFilterChange={() => setActiveCourse(null)}
        />
        <Grid
          container
          spacing={2}
          className={GridStyles.outerGrid}
          alignItems="stretch"
        >
          <Grid item>
            {!activeCourse ? (
              <TrainingCover
                trainingContentCollection={trainingContentCollection}
                lmsUrl={DOCEBO_SSO_URL}
              />
            ) : (
              <TrainingCourseDetail
                course={activeCourse}
                lmsUrl={DOCEBO_SSO_URL}
              />
            )}
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({ apolloClient, account, globalPageData, locale }) => {
    const {
      doceboId,
      market: { domain }
    } = account;

    let trainingData = {};
    try {
      const {
        props: {
          data: { marketByDomain = {} }
        }
      } = await getServerPageDoceboCatalogIdByMarketDomain(
        {
          variables: {
            domain: domain
          }
        },
        apolloClient
      );

      const pageQuery = await getServerPageTraining(
        {
          variables: {
            catalogueId: marketByDomain?.doceboCatalogueId || null,
            userId: doceboId
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
      account,
      globalPageData,
      ...(await serverSideTranslations(locale, [
        "common",
        "sidebar",
        "footer",
        "training-page"
      ]))
    };

    return { props };
  }
);
export default withPageAuthRequired(TrainingPage);

// export doesn't matter for codegen
export const pageQuery = gql`
  query training($catalogueId: Int, $userId: Int) {
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

  query DoceboCatalogIdByMarketDomain($domain: String!) {
    marketByDomain(domain: $domain) {
      doceboCatalogueId
    }
  }
`;
