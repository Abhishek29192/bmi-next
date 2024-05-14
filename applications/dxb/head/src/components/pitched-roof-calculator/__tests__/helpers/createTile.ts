import { ApprovalStatus, createImage } from "@bmi/pim-types";
import type { Tile } from "../../types";

export const createTile = (tile: Partial<Tile>): Tile => ({
  name: "name",
  color: "color",
  brokenBond: false,
  battenSpacings: [
    {
      minAngle: 1,
      maxAngle: 90,
      battenDistance: {
        value: 340,
        unit: "mm"
      },
      firstRowBattenDistance: {
        value: 380,
        unit: "mm"
      }
    }
  ],
  ridgeSpacing: 15,
  minBattenSpacing: 31,
  coverWidth: 30,
  length: 40,
  externalProductCode: "external-product-code",
  packSize: 1,
  coverLength: 30,
  description: "description",
  isSampleOrderAllowed: true,
  longDescription: "long-description",
  shortDescription: "short-description",
  summary: "summary",
  code: "code",
  baseProduct: { code: "base-product-code", name: "base-product-name" },
  brandCode: "brand-code",
  images: [createImage()],
  allCategories: [],
  classifications: [],
  approvalStatus: ApprovalStatus.Approved,
  productScoringWeightInt: 0,
  variantScoringWeightInt: 0,
  totalVariantCount: 1,
  mainImage: createImage().url,
  path: "name-code",
  subTitle: "",
  ...tile
});
