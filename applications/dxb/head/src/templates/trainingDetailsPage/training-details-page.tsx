import Section from "@bmi-digital/components/section";
import { WindowLocation, useLocation } from "@reach/router";
import { graphql } from "gatsby";
import React, { useEffect } from "react";
import BackToResults from "../../components/BackToResults";
import Breadcrumbs from "../../components/Breadcrumbs";
import Page, { Data as PageData } from "../../components/Page";
import { Data as SiteData } from "../../components/Site";
import RegistrationCompletedDialog from "./components/RegistrationCompletedDialog";
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
    contentfulTrainingRegistrationPage: {
      path: string;
      successTitle: string;
      successDescription: { successDescription: string };
      registrationCompletedDialogCloseButton: string;
    } | null;
    contentfulSite: SiteData;
  };
};

const TrainingDetailsPage = ({ data }: Props) => {
  const {
    doceboCourses: { breadcrumbs, ...trainingData },
    contentfulTrainingRegistrationPage,
    contentfulSite
  } = data;

  const {
    state: historyState
  }: WindowLocation<{ showResultsModal?: boolean }> = useLocation();

  const pageData: PageData = {
    breadcrumbs: breadcrumbs,
    signupBlock: null,
    seo: null,
    path: `/t/${trainingData.slug_name}`
  };

  useEffect(() => {
    if (historyState?.showResultsModal === true) {
      history.replaceState({ showResultsModal: false }, "");
    }
  }, [historyState]);

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
        trainingRegistrationUrl={contentfulTrainingRegistrationPage?.path}
      />
      <Section data-testid="breadcrumbs-section-bottom" backgroundColor="white">
        <BackToResults>
          <Breadcrumbs data={breadcrumbs} data-testid="breadcrumbs-bottom" />
        </BackToResults>
      </Section>
      <RegistrationCompletedDialog
        title={contentfulTrainingRegistrationPage?.successTitle}
        description={
          contentfulTrainingRegistrationPage?.successDescription
            .successDescription
        }
        closeButtonLabel={
          contentfulTrainingRegistrationPage?.registrationCompletedDialogCloseButton
        }
        open={Boolean(historyState?.showResultsModal)}
      />
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
      successTitle
      successDescription {
        successDescription
      }
      registrationCompletedDialogCloseButton
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
