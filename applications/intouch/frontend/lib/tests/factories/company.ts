import merge from "lodash/merge";
import { Company } from "@bmi/intouch-api-types";
import { GetCompaniesByMarketQuery } from "../../../graphql/generated/operations";
import { DeepPartial } from "../../utils/types";

const emptyNodes = {
  nodes: []
};

const defaultCompany: GetCompaniesByMarketQuery["companies"]["nodes"][0] = {
  __typename: "Company",
  id: 1,
  name: "Company 1",
  certifications: [],
  companyDocuments: emptyNodes,
  companyMembers: emptyNodes,
  companyOperationsByCompany: emptyNodes,
  isProfileComplete: true,
  referenceNumber: 10001,
  tier: "T1"
};

export const generateCompany = (
  company: DeepPartial<Company> = {}
): GetCompaniesByMarketQuery["companies"]["nodes"][0] =>
  merge(defaultCompany, company);
