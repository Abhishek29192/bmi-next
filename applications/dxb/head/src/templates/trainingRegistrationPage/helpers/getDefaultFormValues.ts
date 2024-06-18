import type { TrainingRegistrationPageData } from "../types";

export const getDefaultFormValues = (data: TrainingRegistrationPageData) => ({
  [data.salutationTitle]: data.salutationMale,
  [data.title]: "",
  [data.firstName]: "",
  [data.lastName]: "",
  [data.email]: "",
  [data.companyName]: "",
  [data.position]: "",
  [data.customerNumber]: "",
  [data.street]: "",
  [data.postalCode]: "",
  [data.city]: "",
  [data.phoneNumber]: "",
  [data.competentChamber]: "",
  [data.bmiSystemPartnerClubTitle]: data.isMemberOfBmiLabel,
  [`${data.discoverySourceOther}-textfield`]: "",
  [data.discoverySourceTitle]: data.discoverySourceBrochure,
  [data.comment]: "",
  consent: undefined,
  "terms-of-use": undefined
});
