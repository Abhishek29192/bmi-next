import type { Training } from "@bmi/elasticsearch-types";
import type { Props } from "../components/training-catalogue";

const getTrainingPreviewImage = (
  courseImg: Training["courseImg"],
  defaultImageUrl: Props["defaultImageUrl"],
  courseName: Training["courseName"]
) => {
  const imgSrc = courseImg || defaultImageUrl;

  return imgSrc
    ? {
        "data-testid": "training-preview-image",
        src: imgSrc,
        alt: courseName
      }
    : undefined;
};

export default getTrainingPreviewImage;
