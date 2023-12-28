import createBreadcrumbItem from "../../../__tests__/helpers/BreadcrumbItemHelper";
import type { TrainingRegistrationPageData } from "../types";

export const trainingRegistrationPageData: TrainingRegistrationPageData = {
  __typename: "ContentfulTrainingRegistrationPage",
  breadcrumbs: [
    createBreadcrumbItem({
      label: "Training Registration Page",
      slug: "/training-registration-page"
    })
  ],
  breadcrumbTitle: "Training Registration Page",
  path: "/no/training-registration-page",
  title: "Title",
  salutationTitle: "Salutation",
  salutationMale: "Mr",
  salutationFemale: "Mrs",
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  companyName: "Company name",
  position: "Position",
  customerNumber: "Customer number",
  city: "City",
  street: "Street",
  postalCode: "Postal code",
  phoneNumber: "Phone number",
  competentChamberLabel: {
    competentChamberLabel:
      "If you need continuing education credits, please indicate the responsible chamber below (Dena, Chamber of Architects, Chamber of Engineers, e.g. AK Berlin, IK Bayern, DENA):"
  },
  competentChamber: "Competent chamber",
  bmiSystemPartnerClubTitle:
    "Are you a member of the [BMI SystemPartner Club](https://fake-url.com/) (subject to a fee)?",
  isMemberOfBmiLabel: "Yes",
  isNotMemberOfBmiLabel: "No",
  discoverySourceTitle: "How did you find out about this event",
  discoverySourceBrochure: "Brochure",
  discoverySourceFieldService: "BMI Field service",
  discoverySourceWebsite: "BMI Academy website",
  discoverySourceFacebook: "Facebook",
  discoverySourceInstagram: "Instagram",
  discoverySourceXing: "Xing",
  discoverySourceLinkedin: "LinkedIn",
  discoverySourceOther: "Other",
  discoverySourceSpecifyOther: "If other, please specify",
  comment: "Comment",
  consentText: {
    consentText: "Consent text"
  },
  termsOfUse: {
    termsOfUse: "Terms of use"
  },
  registerButton: "Submit"
};
