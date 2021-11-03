import { SystemLayer } from "../../pim";

export const createProducts = (codes: string[]) =>
  codes.map((code) => ({ code }));

export const createSystemLayer = (
  layer?: Partial<SystemLayer>
): SystemLayer => ({
  addon: false,
  approvalStatus: "approved",
  code: "Layer_19",
  layerNumber: 1,
  longDescription: "Long Dec System 2 NO",
  optionalProducts: createProducts([
    "400120_Monarplan_Outside_corner_anthracite"
  ]),
  products: createProducts(["300190_Rubber_sheat"]),
  shortDescription: "SDescription 1 NO",
  type: "LAYER_ACCESSORIES",
  ...layer
});
