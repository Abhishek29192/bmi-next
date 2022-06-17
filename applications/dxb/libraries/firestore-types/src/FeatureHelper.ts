import { Feature } from "./types";

const createFeature = (feature?: Partial<Feature>): Feature => ({
  name: "Material",
  value: "Concrete",
  ...feature
});

export default createFeature;
