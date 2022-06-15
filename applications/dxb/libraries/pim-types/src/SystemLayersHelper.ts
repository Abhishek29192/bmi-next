import { SystemLayer } from "./types";

export const createSystemLayerProducts = (codes: string[]) =>
  codes.map((code) => ({ code }));

export const createSystemLayer = (
  layer?: Partial<SystemLayer>
): SystemLayer => ({
  addon: false,
  approvalStatus: "approved",
  code: "Layer_19",
  layerNumber: "layerNo 1",
  longDescription: "Long Dec System 2 NO",
  name: "layer name",
  optionalProducts: createSystemLayerProducts([
    "400120_Monarplan_Outside_corner_anthracite"
  ]),
  products: createSystemLayerProducts(["300190_Rubber_sheat"]),
  shortDescription: "SDescription 1 NO",
  type: "LAYER_ACCESSORIES",
  ...layer
});
