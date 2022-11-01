import { gql } from "@apollo/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Grid } from "@bmi-digital/components";
import { Course } from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { TrainingCourseDetail } from "../components/Cards/TrainingCourseDetail";
import { TrainingCover } from "../components/Cards/TrainingCover";
import { Layout } from "../components/Layout";
import layoutStyles from "../components/Layout/styles.module.scss";
import { TrainingSidePanel } from "../components/SidePanel/TrainingSidePanel";
import {
  GetGlobalDataQuery,
  TrainingQuery
} from "../graphql/generated/operations";
import {
  getServerPageDoceboTiersByMarketId,
  getServerPageTraining
} from "../graphql/generated/page";
import { findAccountCompany } from "../lib/account";
import { withPage } from "../lib/middleware/withPage";
import { getMarketAndEnvFromReq, parseMarketTag } from "../lib/utils";
import { sortCourses } from "../lib/utils/course";
import GridStyles from "../styles/Grid.module.scss";

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
    )!.course as Course;
    setActiveCourse(activeCourse);
  };

  const enrolledCourses = sortCourses(
    courseCatalogues.nodes.filter(
      (c) => c.course.courseEnrollments.nodes[0]?.status === "enrolled"
    )
  );
  const completedCourses = sortCourses(
    courseCatalogues.nodes.filter(
      (c) => c.course.courseEnrollments.nodes[0]?.status === "completed"
    )
  );
  const orderedCourses = sortCourses(
    courseCatalogues.nodes.filter(
      (c) =>
        !["enrolled", "completed"].includes(
          c.course.courseEnrollments.nodes[0]?.status
        )
    )
  );

  const courseCatalog = [
    ...enrolledCourses,
    ...orderedCourses,
    ...completedCourses
  ];

  return (
    <Layout title={t("Training")} pageData={globalPageData}>
      <div className={layoutStyles.sidePanelWrapper}>
        <TrainingSidePanel
          courseCatalog={courseCatalog}
          onCourseSelected={sidePanelHandler}
          onFilterChange={() => setActiveCourse(null)}
        />
        <Grid
          nonce={undefined}
          container
          spacing={2}
          className={GridStyles.outerGrid}
          alignItems="stretch"
        >
          <Grid nonce={undefined} item>
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
  async ({ apolloClient, account, locale, market, req }) => {
    const marketEnv = getMarketAndEnvFromReq(req);
    const contentfulTag = parseMarketTag(marketEnv.market);
    const { doceboUserId } = account;
    const { tier } = findAccountCompany(account) || { tier: "T1" };
    const logger = req.logger("trainingPage");
    const getDoceboCatalogueId = async () => {
      try {
        const {
          props: {
            data: {
              doceboTiers: { nodes }
            }
          }
        } = await getServerPageDoceboTiersByMarketId(
          {
            variables: {
              marketId: market.id
            }
          },
          apolloClient
        );
        const doceboCatalogue = nodes
          .filter(
            ({ tierCode, doceboCatalogueId }) =>
              (tierCode === tier && !!doceboCatalogueId) || tierCode === "T1"
          )
          .sort((a, b) => (a.tierCode === "T1" ? -1 : 1));
        return doceboCatalogue.length > 1
          ? doceboCatalogue[1].doceboCatalogueId
          : doceboCatalogue[0].doceboCatalogueId;
      } catch (error) {
        logger.error({
          message: `failed to get docebo id with status ${error.status}, ERROR: ${error}`
        });
        return null;
      }
    };
    const doceboCatalogueId = await getDoceboCatalogueId();
    let trainingData = {};
    try {
      const pageQuery = await getServerPageTraining(
        {
          variables: {
            catalogueId: doceboCatalogueId,
            userId: doceboUserId,
            tag: contentfulTag
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
);
export default withPageAuthRequired(TrainingPage);

export const pageQuery = gql`
  query training($catalogueId: Int, $userId: Int, $tag: String!) {
    trainingContentCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
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
          slug
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
