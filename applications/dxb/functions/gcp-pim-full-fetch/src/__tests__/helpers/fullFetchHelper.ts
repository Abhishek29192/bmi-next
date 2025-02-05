import { PimTypes } from "@bmi/pim-types";
import { FullFetchRequest } from "../../types";

export const createFullFetchRequest = (
  fullFetchRequest?: Partial<FullFetchRequest>
): FullFetchRequest => ({
  type: PimTypes.Products,
  startPage: 0,
  numberOfPages: 1,
  ...fullFetchRequest
});
