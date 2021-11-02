import merge from "lodash/merge";
import { Guarantee } from "@bmi/intouch-api-types";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import { DeepPartial } from "../../utils/types";

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
