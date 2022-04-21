import { createMeasurements as createFirestoreMeasurements } from "@bmi/firestore-types";
import { Measurements } from "../../types/pim";

const createMeasurements = (
  measurements?: Partial<Measurements>
): Measurements => {
  const firestoreMeasurements = createFirestoreMeasurements() as Measurements;
  return {
    ...firestoreMeasurements,
    ...measurements
  };
};

export default createMeasurements;
