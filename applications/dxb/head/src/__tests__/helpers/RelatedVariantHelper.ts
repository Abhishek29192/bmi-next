import { createRelatedVariant as createFirestoreRelatedVariant } from "@bmi/firestore-types";
import { RelatedVariant } from "../../types/pim";

const createRelatedVariant = (
  relatedVariant?: Partial<RelatedVariant>
): RelatedVariant => {
  const firestoreRelatedVariant =
    createFirestoreRelatedVariant() as RelatedVariant;
  return { ...firestoreRelatedVariant, ...relatedVariant };
};

export default createRelatedVariant;
