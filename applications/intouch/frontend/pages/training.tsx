import React, { useState } from "react";
import { Course } from "@bmi/intouch-api-types";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { gql } from "@apollo/client";
import { TrainingCover } from "../components/Cards/TrainingCover";
import { TrainingSidePanel } from "../components/SidePanel/TrainingSidePanel";
import GridStyles from "../styles/Grid.module.scss";
import { getAuth0Instance } from "../lib/auth0";
import { initializeApollo } from "../lib/apolloClient";
import { TrainingQuery } from "../graphql/generated/operations";
import {
  getServerPageDoceboCatalogIdByMarketDomain,
  getServerPageTraining
} from "../graphql/generated/page";
import { Layout } from "../components/Layout";
import { CourseDescription } from "../components/Cards/CourseDescription";
import { parseAccount } from "../lib/account";

type PageProps = {
  trainingData: {
    data: TrainingQuery;
    error?: {
      message: string;
    };
  };
  username?: string;
};

const DOCEBO_SSO_URL = "/api/docebo-sso";

const TrainingPage = ({ trainingData }: PageProps) => {
  const { t } = useTranslation("training-page");
  const { error, data } = trainingData;

  const [activeCourse, setActiveCourse] = useState<Course>(null);

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

  const sidePanelHandler = (courseId: number) => {
    const activeCourse = courseCatalogues.nodes.find(
      (node) => node.course.courseId === courseId
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
    <Layout title={t("Training")}>
      <div style={{ display: "flex" }}>
        <TrainingSidePanel
          courseCatalog={courseCatalogues}
          onCourseSelected={sidePanelHandler}
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
              <CourseDetail course={activeCourse} />
            )}
          </Grid>
        </Grid>
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
      const { doceboId, marketCode } = parseAccount(user);

      let trainingData = {};
      try {
        const {
          props: {
            data: { marketByDomain = {} }
          }
        } = await getServerPageDoceboCatalogIdByMarketDomain(
          {
            variables: {
              domain: marketCode
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

const CourseDetail = ({ course }: { course: Course }) => {
  const { t } = useTranslation("training-page");
  const { name, trainingType, image, description, courseEnrollments } = course;
  const { status = "General", url = "" } = courseEnrollments.nodes[0] || {};

  return (
    <CourseDescription
      title={name}
      type={trainingType}
      status={status}
      image={image}
      lmsUrl={`${DOCEBO_SSO_URL}?path=${url}`}
    >
      <Typography variant="h5">{t("Description")}</Typography>

      <Typography
        component="div"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </CourseDescription>
  );
};

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
