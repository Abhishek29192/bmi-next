import React, { useMemo } from "react";
import Hero, { HeroItem } from "@bmi/hero";
import Button from "@bmi/button";
import AlertBanner from "@bmi/alert-banner";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { gql } from "@apollo/client";
import type { Course } from "@bmi/intouch-api-types";
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

  const { courses, trainingContentCollection } = data;

  // there will only ever be 1 training collection item
  const { lmsCtaLabel } = trainingContentCollection.items[0];

  const PLACEHOLDER_IMAGE = "https://source.unsplash.com/DJ7bWa-Gwks/600x900";

  // TODO Hero is not the right item to display the courses - should be a list
  const heroes: HeroItem[] = courses.nodes.map((course: Course) => ({
    title: course.name || "",
    children: <CourseItem {...course} />,
    imageSource: course.image || PLACEHOLDER_IMAGE,
    cta: (
      <Button
        label={lmsCtaLabel}
        action={{
          model: "htmlLink",
          href: "", // TODO: what url is this?
          target: "_blank",
          rel: "noopener noreferrer"
        }}
      >
        {lmsCtaLabel}
      </Button>
    )
  }));

  return (
    <Layout title={t("Training")}>
      <Hero level={0} hasSpaceBottom autoPlayInterval={10000} heroes={heroes} />{" "}
    </Layout>
  );
};

const DEFAULT_ENROLLMENT_STATUS = "__TODO__";

const CourseItem = ({
  id,
  description,
  trainingType,
  courseEnrollments
}: Course) => {
  const enrollment = useMemo(
    () =>
      courseEnrollments.nodes.find(
        // hopefully we shouldn't also need to check for user id
        // as the API should return only the trainings for the user
        (e) => e.courseId === id
      ),
    [id, courseEnrollments]
  );
  const status = enrollment ? enrollment.status : DEFAULT_ENROLLMENT_STATUS;
  const url = enrollment ? enrollment.url : "";

  const { t } = useTranslation("training-page");
  return (
    <div>
      <p>{description}</p>
      <AlertBanner severity="warning">
        <AlertBanner.Title>Info</AlertBanner.Title>
        Type/Status : {trainingType} / {status}
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

// export doesn't matter for codegen
export const pageQuery = gql`
  query training {
    trainingContentCollection {
      items {
        lmsCtaLabel
      }
    }
    courses {
      nodes {
        id
        name
        technology
        image
        promoted
        trainingType
        description

        courseEnrollments {
          nodes {
            id
            status
            url
            courseId
          }
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

export const getServerSideProps = async (ctx) => {
  const auth0 = await getAuth0Instance(ctx.req, ctx.res);
  return auth0.withPageAuthRequired({
    async getServerSideProps({ locale, ...ctx }) {
      const apolloClient = await initializeApollo(null, { ...ctx, locale });

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

export default withPageAuthRequired(TrainingPage);
