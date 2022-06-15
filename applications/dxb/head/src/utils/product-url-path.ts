import { Product, RelatedVariant } from "@bmi/firestore-types";

export const generateUrl = (urlParts: string[]) => {
  return urlParts
    .filter(Boolean)
    .map((part) =>
      part
        .replace(/_+/g, "-")
        .replace(/\/+/g, "-")
        .replace(/[^.,\s\p{L}\p{Nd}-]/gu, "")
        .replace(/\.+/g, "-")
        .replace(/,+/g, "-")
    )
    .join("-")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .toLowerCase();
};
// To opt-in to `variant attribute` url
// set useVariantAttribute to `true`
export const generateSimpleProductUrl = (
  variant: Product | RelatedVariant,
  useVariantAttribute: boolean
): string => {
  const productName = variant.name;

  if (useVariantAttribute && variant.variantAttribute) {
    const variantAttributeUrl = generateUrl([
      productName,
      variant.variantAttribute,
      variant.hashedCode
    ]);
    if (variantAttributeUrl.length) {
      return variantAttributeUrl;
    }
  }

  return generateUrl([
    productName,
    variant.colour,
    variant.textureFamily,
    variant.materials,
    variant.hashedCode
  ]);
};
