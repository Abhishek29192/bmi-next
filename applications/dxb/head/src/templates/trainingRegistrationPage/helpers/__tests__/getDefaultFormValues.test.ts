import { trainingRegistrationPageData } from "../../__mocks__/trainingRegistrationPage";
import { getDefaultFormValues } from "../getDefaultFormValues";

describe("getDefaultFormValues helper", () => {
  it("returns correct default values", () => {
    const defaultValues = getDefaultFormValues(trainingRegistrationPageData);
    expect(defaultValues).toEqual({
      [trainingRegistrationPageData.salutationTitle]:
        trainingRegistrationPageData.salutationMale,
      [trainingRegistrationPageData.title]: "",
      [trainingRegistrationPageData.firstName]: "",
      [trainingRegistrationPageData.lastName]: "",
      [trainingRegistrationPageData.email]: "",
      [trainingRegistrationPageData.companyName]: "",
      [trainingRegistrationPageData.position]: "",
      [trainingRegistrationPageData.customerNumber]: "",
      [trainingRegistrationPageData.street]: "",
      [trainingRegistrationPageData.postalCode]: "",
      [trainingRegistrationPageData.city]: "",
      [trainingRegistrationPageData.phoneNumber]: "",
      [trainingRegistrationPageData.competentChamber]: "",
      [trainingRegistrationPageData.bmiSystemPartnerClubTitle]:
        trainingRegistrationPageData.isMemberOfBmiLabel,
      [`${trainingRegistrationPageData.discoverySourceOther}-textfield}`]: "",
      [trainingRegistrationPageData.discoverySourceTitle]:
        trainingRegistrationPageData.discoverySourceBrochure,
      [trainingRegistrationPageData.comment]: "",
      consent: undefined,
      "terms-of-use": undefined
    });
  });
});
