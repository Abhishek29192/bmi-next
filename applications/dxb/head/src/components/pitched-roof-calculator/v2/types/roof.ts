import { RoofBase, RoofType } from "../../types/roof";

export type Roof = RoofBase & {
  id: string;
  name: string;
  type: RoofType;
  roofPitchField: string;
};
