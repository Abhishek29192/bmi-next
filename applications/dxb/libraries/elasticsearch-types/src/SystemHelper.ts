import { createImage } from "@bmi/pim-types";
import { System } from "./types";

const createSystem = (esSystem?: Partial<System>): System => ({
  approvalStatus: "approved",
  brand: "BMI-brand-code",
  type: "systemWsDTO",
  images: [createImage()],
  code: "code",
  name: "name",
  path: "/s/code-name-hashed-code",
  shortDescription: "Short description",
  hashedCode: "hashed-code",
  ...esSystem
});

export default createSystem;
