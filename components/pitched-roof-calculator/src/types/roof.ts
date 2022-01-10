import { SVGImport } from "@bmi/svg-import";
import { Type } from "../helpers/fieldTypes";

export type RoofType = "gable" | "hipped" | "sloped";

export type DimensionsField = {
  name: string;
  type: Type;
};

export type DimensionsValues = Record<string, string> & {
  protrusions?: Record<string, keyof Protrusion>[];
};

export type DimensionsFieldsValues<Fields extends string> = {
  [F in Fields]: string;
};

export type ProtrusionDimensionsFieldsValues<Fields extends string> =
  DimensionsFieldsValues<Fields> & {
    roofPitch: string;
  };

export type Point = { x: number; y: number };

export type Side = "VERGE" | "VALLEY" | "HIP";

export type Face = {
  vertices: Point[];
  pitch: number;
  sides: [Side, Side];
  subtract?: boolean;
};

export type Vertex = Point & { side?: Side };

export type FaceWithBattens = Face & {
  battens: any[];
};

export type Line = { length: number };

export type ValleyLine = Line & {
  start?: boolean;
  end?: boolean;
  top?: boolean;
  dormerStart?: boolean;
};

export type LinesMap = {
  hip: Line[];
  ridge: Line[];
  eave: Line[];
  leftVerge: Line[];
  rightVerge: Line[];
  valley: ValleyLine[];
};

export type Measurements = {
  faces: Face[];
  lines: LinesMap;
  area?: number;
};

export type RoofBase = {
  illustration: SVGImport;
  dimensionsIllustration: SVGImport;
  fields: ReadonlyArray<DimensionsField>;
  getMeasurements: (values: DimensionsValues) => Measurements;
};

export type Roof = RoofBase & {
  name: string;
  type: RoofType;
  roofPitchField: string;
};

export type Protrusion = RoofBase;
