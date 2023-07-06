import { createCategory } from "@bmi/pim-types";
import { Image, System } from "./types";

const createSystemImage = (): Image => ({
  mainSource: "http://localhost:8000/mainSource",
  thumbnail: "http://localhost:8000/thumbnail",
  altText: "Alt text"
});

const createSystem = (esSystem?: Partial<System>): System => ({
  approvalStatus: "approved",
  brand: createCategory({}),
  code: "code",
  hashedCode: "hashed-code",
  galleryImages: [createSystemImage()],
  name: "name",
  path: "/s/code-name-hashed-code",
  scoringWeight: 1,
  systemAttributes: [
    {
      code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.roofBuildUp",
      name: "Roof build-up",
      values: [
        "Combines self-adhesive/heat activated and torch applied installation techniques"
      ]
    }
  ],
  shortDescription: "Short description",
  type: "systemWsDTO",
  ...esSystem
});

export default createSystem;
