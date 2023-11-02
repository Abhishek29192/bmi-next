import { PimTypes } from "@bmi/pim-types";

export type FullFetchRequest = {
  type: PimTypes | "documents" | "trainings";
  startPage: number;
  numberOfPages: number;
};
