import { RelatedVariant } from "./types";

const createRelatedVariant = (
  relatedProduct?: Partial<RelatedVariant>
): RelatedVariant => ({
  code: "related",
  name: "name",
  measurements: { label: "label" },
  hashedCode: "hashed-related-code",
  path: "/p/name-hashed-related-code",
  ...relatedProduct
});

export default createRelatedVariant;
