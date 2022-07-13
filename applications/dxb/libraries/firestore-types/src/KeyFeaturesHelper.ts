import { KeyFeatures } from "./types";

const createKeyFeatures = (
  keyFeatures?: Partial<KeyFeatures>
): KeyFeatures => ({
  name: "key-feature",
  values: ["key-feature-value"],
  ...keyFeatures
});

export default createKeyFeatures;
