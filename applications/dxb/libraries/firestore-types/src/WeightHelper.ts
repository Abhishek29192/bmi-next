import { Weight } from "./types";

const createWeight = (weight?: Partial<Weight>): Weight => ({
  grossWeight: {
    unit: "symbol",
    value: "6"
  },
  netWeight: {
    unit: "symbol",
    value: "7"
  },
  weightPerPallet: {
    unit: "symbol",
    value: "8"
  },
  weightPerPiece: {
    unit: "symbol",
    value: "9"
  },
  weightPerSqm: {
    unit: "symbol",
    value: "10"
  },
  ...weight
});

export default createWeight;
