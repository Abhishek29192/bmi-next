import { PimTypes } from "@bmi/pim-types";

export type FullFetchRequest = {
  type: PimTypes;
  startPage: number;
  numberOfPages: number;
};
