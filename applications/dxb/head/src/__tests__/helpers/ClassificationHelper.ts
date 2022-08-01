import { Feature } from "@bmi/firestore-types";
import { Classification } from "../../types/pim";

const createClassification = (
  classification?: Partial<Classification>
): Classification => ({
  name: "appearanceAttributes",
  features: [createFeature()],
  ...classification
});

export const createFeature = (feature?: Partial<Feature>): Feature => ({
  name: "classification-feature-name",
  value: "classification-feature-value",
  ...feature
});

export default createClassification;
