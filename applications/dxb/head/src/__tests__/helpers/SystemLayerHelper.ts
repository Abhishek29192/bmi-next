import { SystemLayer } from "../../types/pim";
import createProduct from "./ProductHelper";

const createSystemLayer = (systemLayer?: Partial<SystemLayer>): SystemLayer => {
  return {
    name: "system-layer-1",
    layerNumber: 1,
    type: "layer-type-1",
    relatedProducts: [
      createProduct({ code: "related-product-1", name: "related-product-1" })
    ],
    relatedOptionalProducts: [
      createProduct({
        code: "optional-related-product-1",
        name: "optional-related-product-1"
      })
    ],
    shortDescription: "layer-short-description",
    ...systemLayer
  };
};

export default createSystemLayer;
