import { createWeight as createFirestoreWeight } from "@bmi/firestore-types";
import { Weight } from "../../types/pim";

const createWeight = (weight?: Partial<Weight>): Weight => {
  const firestoreWeight = createFirestoreWeight() as Weight;
  return { ...firestoreWeight, ...weight };
};

export default createWeight;
