import { SystemLayer } from "./types";

const createSystemLayer = (
  systemLayer?: Partial<SystemLayer>
): SystemLayer => ({
  layerNumber: "1",
  name: "layer name",
  relatedProducts: ["product-code-1"],
  relatedOptionalProducts: ["product-code-2"],
  shortDescription: "short description",
  type: "layer-type",
  ...systemLayer
});

export default createSystemLayer;
