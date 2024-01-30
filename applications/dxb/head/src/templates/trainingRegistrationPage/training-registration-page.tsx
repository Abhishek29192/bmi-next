import Section from "@bmi-digital/components/section";
import { isDefined } from "@bmi/utils";
import { graphql } from "gatsby";
import React, { useMemo } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import Page, { Data as PageData } from "../../components/Page";
import ProgressIndicator from "../../components/ProgressIndicator";
import Scrim from "../../components/Scrim";
import { updateBreadcrumbTitleFromContentful } from "../../utils/breadcrumbUtils";
import { getPathWithCountryCode } from "../../utils/path";
import TrainingRegistrationForm from "./components/TrainingRegistrationForm";
import TrainingRegistrationHeader from "./components/TrainingRegistrationHeader";
import { useRegistration } from "./hooks/useRegistration";
import type { BreadcrumbItem } from "../../types/pim";
import type { TrainingRegistrationPageProps } from "./types";

const TrainingRegistrationPage = ({
  data: {
    contentfulSite,
    contentfulTrainingListerPage,
    contentfulTrainingRegistrationPage
  }
}: TrainingRegistrationPageProps) => {
  const { path } = contentfulTrainingRegistrationPage;

  const { training, loading } = useRegistration();
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
    const currentPageBreadcrumb = [
      ...updateBreadcrumbTitleFromContentful(
        contentfulTrainingRegistrationPage.breadcrumbs,
        contentfulTrainingRegistrationPage.breadcrumbTitle
      )
    ].pop();

    const trainingPageBreadcrumb = training && {
      id: training.id,
      label: training.name,
      slug: `/t/${training.slug}`
    };

    const trainingListerPageBreadcrumb = contentfulTrainingListerPage && {
      ...[...contentfulTrainingListerPage.breadcrumbs].pop(),
      slug: contentfulTrainingListerPage.path
    };

    return [
      trainingListerPageBreadcrumb,
      trainingPageBreadcrumb,
      currentPageBreadcrumb
    ].filter(isDefined);
  }, [
    training,
    contentfulTrainingRegistrationPage,
    contentfulTrainingListerPage
  ]);

  const pageData: PageData = {
    breadcrumbs,
    signupBlock: null,
    seo: { noIndex: true, metaTitle: null, metaDescription: null },
    path
  };

  return (
    <Page
      title={contentfulTrainingRegistrationPage.breadcrumbTitle}
      siteData={contentfulSite}
      pageData={pageData}
    >
      {loading && (
        <Scrim theme="light">
          <ProgressIndicator theme="light" />
        </Scrim>
      )}
      <Section backgroundColor="white" data-testid="breadcrumbs-section-top">
        <Breadcrumbs
          data={breadcrumbs}
          concatenateUrls={false}
          data-testid="breadcrumbs-top"
        />
      </Section>
      {training && <TrainingRegistrationHeader training={training} />}
      {!loading && !training ? null : (
        <TrainingRegistrationForm
          {...contentfulTrainingRegistrationPage}
          trainingDetailsPageUrl={getPathWithCountryCode(
            contentfulSite.countryCode,
            `/t/${training?.slug}`
          )}
          courseCode={training?.code}
        />
      )}
      <Section backgroundColor="white" data-testid="breadcrumbs-section-bottom">
        <Breadcrumbs
          data={breadcrumbs}
          concatenateUrls={false}
          data-testid="breadcrumbs-bottom"
        />
      </Section>
    </Page>
  );
};

export default TrainingRegistrationPage;

export const pageQuery = graphql`
  query TrainingRegistrationPageById(
    $pageId: String!
    $siteId: String!
    $tagFilter: ContentfulMetadataFilterInput!
  ) {
    contentfulTrainingRegistrationPage(id: { eq: $pageId }) {
      ...BreadcrumbsFragment
      path
      title
      salutationTitle
      salutationMale
      salutationFemale
      firstName
      lastName
      email
      companyName
      position
      customerNumber
      city
      street
      postalCode
      phoneNumber
      competentChamber
      recipient
      emailSubject
      competentChamberLabel {
        competentChamberLabel
      }
      bmiSystemPartnerClubTitle
      isMemberOfBmiLabel
      isNotMemberOfBmiLabel
      discoverySourceTitle
      discoverySourceBrochure
      discoverySourceFieldService
      discoverySourceWebsite
      discoverySourceFacebook
      discoverySourceInstagram
      discoverySourceXing
      discoverySourceLinkedin
      discoverySourceOther
      discoverySourceSpecifyOther
      comment
      extraParticipantTitle
      extraParticipantSubtitle
      addParticipantsButton
      newParticipantTitle
      removeParticipantButton
      newParticipantFirstName
      newParticipantLastName
      consentText {
        consentText
      }
      termsOfUse {
        termsOfUse
      }
      registerButton
    }
    contentfulTrainingListerPage(metadata: $tagFilter) {
      path
      ...BreadcrumbsFragment
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
