import { UnitValue } from "@bmi/firestore-types";
import { Product as ProductSchema, QuantitativeValue } from "schema-dts";
import { Product } from "../types/pim";
import { getPathWithCountryCode } from "../utils/path";

// TODO: need to extract getting the combined categories
export const createSchemaOrgDataForPdpPage = (
  variant: Product,
  countryCode: string
): ProductSchema => ({
  "@type": "Product",
  award: variant.awardsAndCertificateDocuments.find(
    (asset) => asset.assetType === "AWARDS"
  )?.name,
  brand:
    variant.brand && variant.brand.name
      ? {
          "@type": "Brand",
          name: variant.brand.name
        }
      : undefined,
  // category: getCategory(baseProduct),
  color: variant.colour || undefined,
  logo: variant.brand?.logo,
  material: variant.materials || undefined,
  weight: getWeight(variant),
  width: asQuantitativeValue(variant.measurements?.width),
  height: asQuantitativeValue(variant.measurements?.height),
  size: getSize(variant),
  image: variant.masterImage?.mainSource,
  productID: variant.code,
  pattern: variant.textureFamily || undefined,
  model: variant.name,
  name: variant.name,
  description: variant.description,
  url: getPathWithCountryCode(countryCode, variant.path)
});

// TODO: What is the desired category here?
// const getCategory = (baseProduct: Product) => {
//   const categories = getProductCategoriesByCategoryType(
//     baseProduct,
//     "Category"
//   );
//   return categories[0];
// };

const getWeight = (product: Product): QuantitativeValue | undefined => {
  const weight =
    product.weight?.weightPerPiece ||
    product.weight?.grossWeight ||
    product.weight?.netWeight ||
    product.weight?.weightPerSqm ||
    product.weight?.weightPerPallet;

  return asQuantitativeValue(weight);
};

const asQuantitativeValue = (
  unitValue?: UnitValue
): QuantitativeValue | undefined =>
  unitValue && {
    "@type": "QuantitativeValue",
    value: unitValue.value,
    valueReference: unitValue.unit
  };

const getSize = (product: Product) =>
  product.measurements?.volume
    ? `${product.measurements.volume.value}${product.measurements.volume.unit}`
    : product.measurements?.label;
