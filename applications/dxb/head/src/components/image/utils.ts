import type { Data, Options } from "./types";

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
