import Section from "@bmi-digital/components/section";
import { graphql } from "gatsby";
import React, { useMemo, useState } from "react";
import { isDefined } from "@bmi/utils";
import type { Training } from "@bmi/elasticsearch-types";
import Breadcrumbs from "../../components/Breadcrumbs";
import Page, { Data as PageData } from "../../components/Page";
import ProgressIndicator from "../../components/ProgressIndicator";
import Scrim from "../../components/Scrim";
import { updateBreadcrumbTitleFromContentful } from "../../utils/breadcrumbUtils";
import { getPathWithCountryCode } from "../../utils/path";
import TrainingRegistrationForm from "./components/TrainingRegistrationForm";
import TrainingRegistrationHeader from "./components/TrainingRegistrationHeader";
import WarningDialog from "./components/WarningDialog";
import { useRegistration } from "./hooks/useRegistration";
import { useShowWarningModal } from "./hooks/useShowWarningModal";
import { FormStatus, type TrainingRegistrationPageProps } from "./types";
import type { BreadcrumbItem } from "../../types/pim";

const useBreadcrumbs = (
  contentfulTrainingRegistrationPage: TrainingRegistrationPageProps["data"]["contentfulTrainingRegistrationPage"],
  contentfulTrainingListerPage: TrainingRegistrationPageProps["data"]["contentfulTrainingListerPage"],
  training?: Training
): BreadcrumbItem[] => {
  return useMemo(() => {
    const registrationPageBreadcrumbs = updateBreadcrumbTitleFromContentful(
      contentfulTrainingRegistrationPage.breadcrumbs,
      contentfulTrainingRegistrationPage.breadcrumbTitle
    );
    const currentPageBreadcrumb =
      registrationPageBreadcrumbs[registrationPageBreadcrumbs.length - 1];

    const trainingPageBreadcrumb: BreadcrumbItem | undefined = training && {
      id: training.courseId.toString(),
      label: training.courseName,
      slug: `t/${training.courseSlug}`
    };

    const trainingListerPageBreadcrumb: BreadcrumbItem | undefined =
      contentfulTrainingListerPage
        ? {
            ...contentfulTrainingListerPage.breadcrumbs[
              contentfulTrainingListerPage.breadcrumbs.length - 1
            ],
            slug: contentfulTrainingListerPage.path
          }
        : undefined;

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
};

const getPageData = (breadcrumbs: BreadcrumbItem[], path: string): PageData => {
  return {
    breadcrumbs,
    signupBlock: null,
    seo: { noIndex: true, metaTitle: null, metaDescription: null },
    path
  };
};

const TrainingRegistrationPage = ({
  data: {
    contentfulSite,
    contentfulTrainingListerPage,
    contentfulTrainingRegistrationPage
  }
}: TrainingRegistrationPageProps) => {
  const [formStatus, setFormStatus] = useState(FormStatus.Initialized);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { path } = contentfulTrainingRegistrationPage;
  const { training, loading } = useRegistration();
  const { blockedLocation, closeWarningDialog } = useShowWarningModal({
    formStatus,
    isSubmitting
  });

  const breadcrumbs = useBreadcrumbs(
    contentfulTrainingRegistrationPage,
    contentfulTrainingListerPage,
    training
  );

  const pageData = getPageData(breadcrumbs, path);

  return (
    <Page
      title={contentfulTrainingRegistrationPage.breadcrumbTitle}
      siteData={contentfulSite}
      pageData={pageData}
    >
      {blockedLocation && (
        <WarningDialog
          blockedUrl={blockedLocation.href}
          closeDialog={closeWarningDialog}
        />
      )}
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
          formData={contentfulTrainingRegistrationPage}
          trainingDetailsPageUrl={getPathWithCountryCode(
            contentfulSite.countryCode,
            `/t/${training?.courseSlug}`
          )}
          courseCode={training?.courseCode}
          training={training}
          setFormStatus={setFormStatus}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
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
