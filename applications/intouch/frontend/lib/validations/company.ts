import { GetCompanyQuery } from "../../graphql/generated/operations";
import { validateObject } from "./utils";
import { validateAddress } from "./address";

export const companyProfileMandatoryFields = [
  "tradingAddress",
  "phone",
  "publicEmail",
  "aboutUs",
  "logo"
];

export type CompanyProfileMandatoryFields =
  typeof companyProfileMandatoryFields;

export const validateCompanyProfile = (
  company: Partial<GetCompanyQuery["company"]>
): { result: boolean; missingFields: CompanyProfileMandatoryFields } => {
  const tradingAddressValidation = validateAddress(company.tradingAddress);
  const companyFieldsValidation = validateObject(
    company,
    companyProfileMandatoryFields.filter((el) => el !== "tradingAddress")
  );
  const missingFields = [
    ...(tradingAddressValidation.result ? [] : ["tradingAddress"]),
    ...companyFieldsValidation.missingFields
  ];
  return {
    result: missingFields.length === 0,
    missingFields
  };
};
