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
  systemAttributes: ["Product, Product & Workmanship, System"],
  shortDescription: "Short description",
  type: "systemWsDTO",
  ...esSystem
});

export default createSystem;
