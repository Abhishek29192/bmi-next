import { createProduct } from "@bmi/firestore-types";
import { RelatedProduct } from "../../types/pim";

const createRelatedProduct = (
  relatedProduct?: Partial<RelatedProduct>
): RelatedProduct => {
  const product = createProduct();
  return {
    baseCode: product.baseCode,
    baseScoringWeight: product.baseScoringWeight,
    brand: product.brand ? { code: "code", name: undefined, logo: null } : null,
    code: product.code,
    colour: product.colour || null,
    colourFamily: product.colourFamily || null,
    externalProductCode: product.externalProductCode || null,
    masterImage: product.masterImage
      ? {
          mainSource: "http://localhost:8000",
          thumbnail: "thumbnail-text",
          altText: "alt-text"
        }
      : null,
    measurements: product.measurements
      ? {
          length: null,
          width: null,
          height: null,
          thickness: null,
          volume: null,
          label: "6x7x8symbol"
        }
      : null,
    name: product.name,
    path: "/path",
    groups: product.groups,
    textureFamily: product.textureFamily || null,
    ...relatedProduct
  };
};

export default createRelatedProduct;
