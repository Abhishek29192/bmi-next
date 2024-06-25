import { GatsbyImage } from "gatsby-plugin-image";
import { getPosition, typeToObjectFitMap } from "./utils";
import type {
  CustomImageProps,
  ImageProps
} from "@bmi-digital/components/dist/media/types";
import type { Props } from "./types";

export const createImageProps = (
  imageData: Props
): ImageProps | CustomImageProps => {
  const {
    altText,
    image,
    className,
    size,
    type,
    position,
    focalPoint,
    isMobile,
    loading,
    "data-testid": dataTestId
  } = imageData;

  const objectFit = size || typeToObjectFitMap[type || "Decorative"];
  const objectPosition = getPosition({
    size,
    position,
    focalPoint,
    isMobile
  });

  const imgLoading = loading ? loading : "lazy";
  return image.gatsbyImageData
    ? {
        component: GatsbyImage,
        image: image.gatsbyImageData,
        alt: altText,
        draggable: false,
        objectFit,
        objectPosition,
        className,
        loading: imgLoading,
        "data-testid": dataTestId
      }
    : {
        alt: altText,
        src: image.file.url,
        className,
        style: {
          objectFit,
          objectPosition
        },
        loading: imgLoading,
        "data-testid": dataTestId
      };
};

export default createImageProps;
