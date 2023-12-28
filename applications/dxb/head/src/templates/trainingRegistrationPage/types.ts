import type { Training } from "@bmi/elasticsearch-types";
import type { ESResponse } from "../../types/elasticsearch";
import type { Data as SiteData } from "../../components/Site";
import type { Data as BreadcrumbsData } from "../../components/Breadcrumbs";

export type TrainingRegistrationPageData = {
  __typename: "ContentfulTrainingRegistrationPage";
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
