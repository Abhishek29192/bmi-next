import NextImage from "next/image";
import { getPosition, getSizes, loader, typeToObjectFitMap } from "./utils";
import type { CustomImageProps } from "@bmi-digital/components/media";
import type { Props } from "./types";

const createContentfulImageProps = ({
  image,
  size,
  position,
  focalPoint,
  isMobile,
  type,
  altText,
  widths,
  loading = "lazy",
  className,
  "data-testid": dataTestId
}: Props): CustomImageProps => {
  const { url } = image;

  const formattedUrl = url.startsWith("https:") ? url : `https:${url}`;

  const sizes = getSizes(widths);
  const objectFit = size || typeToObjectFitMap[type || "Decorative"];
  const objectPosition = getPosition({
    size,
    position,
    focalPoint,
    isMobile
  });

  return {
    component: NextImage,
    loader,
    src: formattedUrl,
    alt: altText,
    draggable: false,
    style: {
      objectFit,
      objectPosition,
      width: undefined,
      height: undefined
    },
    className,
    decoding: "async",
    fill: true,
    loading,
    sizes,
    "data-testid": dataTestId
  };
};

export default createContentfulImageProps;
