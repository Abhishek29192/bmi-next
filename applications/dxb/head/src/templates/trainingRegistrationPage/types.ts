import type { Training } from "@bmi/elasticsearch-types";
import type { Data as BreadcrumbsData } from "../../components/Breadcrumbs";
import type { Data as SiteData } from "../../components/Site";
import type { ESResponse } from "../../types/elasticsearch";

export type TrainingRegistrationPageData = {
  __typename: "ContentfulTrainingRegistrationPage";
  recipient: string;
  emailSubject: string;
  breadcrumbs: BreadcrumbsData;
  breadcrumbTitle: string | null;
  path: string;
  title: string;
  salutationTitle: string;
  salutationMale: string;
  salutationFemale: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  position: string;
  customerNumber: string;
  city: string;
  street: string;
  postalCode: string;
  phoneNumber: string;
  competentChamberLabel: {
    competentChamberLabel: string;
  };
  competentChamber: string;
  bmiSystemPartnerClubTitle: string;
  isMemberOfBmiLabel: string;
  isNotMemberOfBmiLabel: string;
  discoverySourceTitle: string;
  discoverySourceBrochure: string;
  discoverySourceFieldService: string;
  discoverySourceWebsite: string;
  discoverySourceFacebook: string;
  discoverySourceInstagram: string;
  discoverySourceXing: string;
  discoverySourceLinkedin: string;
  discoverySourceOther: string;
  discoverySourceSpecifyOther: string;
  comment: string;
  extraParticipantTitle: string;
  extraParticipantSubtitle: string;
  addParticipantsButton: string;
  newParticipantTitle: string;
  removeParticipantButton: string;
  newParticipantFirstName: string;
  newParticipantLastName: string;
  consentText: {
    consentText: string;
  };
  termsOfUse: {
    termsOfUse: string;
  };
  registerButton: string;
};

export type TrainingRegistrationPageProps = {
  data: {
    contentfulTrainingRegistrationPage: TrainingRegistrationPageData;
    contentfulTrainingListerPage: {
      path: string;
      breadcrumbs: BreadcrumbsData;
    } | null;
    contentfulSite: SiteData;
  };
};

export type ESTrainingDetails = ESResponse<Training>;

export enum FormStatus {
  Initialized = "initialized",
  Edited = "edited"
}
