import merge from "lodash/merge";
import { Guarantee } from "@bmi/intouch-api-types";
import {
  GetProjectQuery,
  GetGuaranteesReportQuery
} from "../../../graphql/generated/operations";
import { DeepPartial } from "../../utils/types";

export type MockGuarantee = Partial<
  {
    project?: Partial<GetProjectQuery["project"]>;
  } & GetGuaranteesReportQuery["guaranteesByMarket"]["nodes"][0] &
    GetProjectQuery["project"]["guarantees"]["nodes"][0]
>;

const defaultGuarantee: GetProjectQuery["project"]["guarantees"]["nodes"][0] = {
  id: 1,
  guaranteeReferenceCode: "PITCHED_SOLUTION",
  coverage: "SOLUTION",
  status: "NEW"
};

export const generateGuarantee = (
  guarantee: DeepPartial<Guarantee> = {}
): GetProjectQuery["project"]["guarantees"]["nodes"][0] =>
  merge(defaultGuarantee, guarantee);

export const guaranteeFactory = (
  guarantee: MockGuarantee = {}
): MockGuarantee => {
  const { project, ...restGuarantee } = guarantee;
  return {
    id: 1,
    guaranteeReferenceCode: "PITCHED_PRODUCT",
    coverage: "PRODUCT",
    languageCode: "EN",
    requestorAccountId: 2,
    systemBySystemBmiRef: {
      id: 1,
      name: "TEST-SYS-2",
      systemMembersBySystemBmiRef: { nodes: [] }
    },
    productByProductBmiRef: {
      id: 1,
      name: "TEST-PROD-1",
      brand: "brand",
      family: "family"
    },
    reviewerAccountId: 1,
    status: "APPROVED",
    bmiReferenceId: "MOCK-1",
    project: {
      ...project
    },
    ...restGuarantee
  };
};
