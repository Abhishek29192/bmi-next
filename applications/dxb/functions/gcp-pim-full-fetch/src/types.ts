import { PimTypes } from "@bmi/pim-types";

export type FullFetchRequest = {
  type: PimTypes | "documents";
  startPage: number;
  numberOfPages: number;
};
