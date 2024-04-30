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
  //'}' will be removed from the field name after switching to common components v2
  [`${data.discoverySourceOther}-textfield}`]: "",
  [data.discoverySourceTitle]: data.discoverySourceBrochure,
  [data.comment]: "",
  consent: undefined,
  "terms-of-use": undefined
});
