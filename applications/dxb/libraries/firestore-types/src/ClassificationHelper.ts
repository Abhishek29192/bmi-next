import { Classification } from "./types";

const createClassification = (
  classification?: Partial<Classification>
): Classification => ({
  features: [
    {
      name: "Material",
      value: "Concrete"
    }
  ],
  name: "General",
  ...classification
});

export default createClassification;
