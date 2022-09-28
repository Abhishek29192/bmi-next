import { createProduct } from "@bmi/firestore-types";
import { Brand, Image, Measurements, RelatedProduct } from "../../types/pim";

const createRelatedProduct = (
  relatedProduct?: Partial<RelatedProduct>
): RelatedProduct => {
  const product = createProduct();
  return {
    baseCode: product.baseCode,
    baseScoringWeight: product.baseScoringWeight,
    brand: product.brand as Brand,
    code: product.code,
    colour: product.colour,
    colourFamily: product.colourFamily,
    externalProductCode: product.externalProductCode,
    masterImage: product.masterImage as Image,
    measurements: product.measurements as Measurements,
    name: product.name,
    path: "/path",
    groups: product.groups,
    textureFamily: product.textureFamily,
    ...relatedProduct
  };
};

export default createRelatedProduct;
