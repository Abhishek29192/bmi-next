import { RelatedSystem } from "../../types/pim";
import createImage from "./ImageHelper";

const createRelatedSystem = (
  relatedVariant?: Partial<RelatedSystem>
): RelatedSystem => {
  return {
    code: "related-system-1",
    brand: { code: "related-system-brand-1" },
    name: "related-ssytem-name",
    path: "related-system-path",
    images: [createImage()],
    scoringWeight: 0,
    shortDescription: "related-short-desc",
    ...relatedVariant
  };
};

export default createRelatedSystem;
