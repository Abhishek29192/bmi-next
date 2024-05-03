import type { ImageLoaderProps } from "next/image";
import type { Data, Options, Props } from "./types";

export const typeToObjectFitMap: {
  [key in NonNullable<Data["type"]>]: Options["size"];
} = {
  Decorative: "cover",
  Descriptive: "contain"
};

export const getPosition = ({
  size,
  position,
  focalPoint,
  isMobile
}: Options & Pick<Data, "focalPoint">): Options["position"] => {
  if (position) {
    return position;
  }

  if (!isMobile && size === "cover" && focalPoint) {
    return `${focalPoint.x}% ${focalPoint.y}%`;
  }

  return "center";
};

export const loader = ({ src, width }: ImageLoaderProps) => {
  return `${src}?w=${width}&q=50`;
};

export const getSizes = (widths: Props["widths"]) =>
  `(max-width: 599px) ${widths[0]}px, (max-width: 719px) ${widths[1]}px, (max-width: 839px) ${widths[2]}px, (max-width: 1439px) ${widths[3]}px, ${widths[4]}px`;
