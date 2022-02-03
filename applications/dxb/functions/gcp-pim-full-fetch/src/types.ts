import { PimTypes } from "@bmi/pim-api";

export type FullFetchRequest = {
  type: PimTypes;
  startPage: number;
  numberOfPages: number;
};
