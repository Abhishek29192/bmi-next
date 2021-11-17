import { PimTypes } from "./pim";

export type FullFetchRequest = {
  type: PimTypes;
  startPage: number;
  numberOfPages: number;
};
