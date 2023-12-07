import React from "react";
import { graphql } from "gatsby";
import Section from "@bmi-digital/components/section";
import Page, { Data as PageData } from "../../components/Page";
import { Data as SiteData } from "../../components/Site";
import BackToResults from "../../components/BackToResults";
import Breadcrumbs from "../../components/Breadcrumbs";
import TrainingDetail from "./components/TrainingDetail";
import { StyledTopBreadcrumbsSection } from "./trainingDetailsPageStyles";
import type { TrainingDetailsCourseType as Course } from "./types";

export type Props = {
  pageContext: {
    courseId: number;
    siteId: string;
    countryCode: string;
  };
  data: {
    doceboCourses: Course;
    contentfulTrainingRegistrationPage: { path: string } | null;
    contentfulSite: SiteData;
  };
};

const TrainingDetailsPage = ({ data }: Props) => {
  const {
    doceboCourses: { breadcrumbs, ...trainingData },
    contentfulTrainingRegistrationPage: { path: trainingRegistrationUrl },
    contentfulSite
  } = data;

  const pageData: PageData = {
    breadcrumbs: breadcrumbs,
    signupBlock: null,
    seo: null,
    path: `/t/${trainingData.slug_name}`
  };

  return (
    <Page
      title={trainingData.name}
      pageData={pageData}
      siteData={contentfulSite}
    >
      <StyledTopBreadcrumbsSection
        data-testid="breadcrumbs-section-top"
        backgroundColor="pearl"
      >
        <BackToResults isDarkThemed>
          <Breadcrumbs
            isDarkThemed
            data={breadcrumbs}
            data-testid="breadcrumbs-top"
          />
        </BackToResults>
      </StyledTopBreadcrumbsSection>
      <TrainingDetail
        course={trainingData}
        trainingRegistrationUrl={trainingRegistrationUrl}
      />
      <Section data-testid="breadcrumbs-section-bottom" backgroundColor="white">
        <BackToResults>
          <Breadcrumbs data={breadcrumbs} data-testid="breadcrumbs-bottom" />
        </BackToResults>
      </Section>
    </Page>
  );
};

export default TrainingDetailsPage;

export const pageQuery = graphql`
  query TrainingDetailsPage(
    $courseId: Int!
    $siteId: String!
    $tagFilter: ContentfulMetadataFilterInput!
  ) {
    doceboCourses(id_course: { eq: $courseId }) {
      id_course
      name
      description
      code
      categoryName
      currencySymbol
      price
      course_type
      img_url
      sessions {
        code
        name
        date_start
        date_end
      }
      breadcrumbs {
        id
        label
        slug
      }
    }
    contentfulTrainingRegistrationPage(metadata: $tagFilter) {
      path
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
