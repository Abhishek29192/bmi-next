import NextImage from "next/image";
import React from "react";
import { getPosition, getSizes, loader, typeToObjectFitMap } from "./utils";
import type { Props } from "./types";

const ContentfulImage = ({
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
}: Props) => {
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

  return (
    <NextImage
      loader={loader}
      src={formattedUrl}
      alt={altText}
      draggable={false}
      style={{
        objectFit: objectFit,
        objectPosition: objectPosition,
        width: undefined,
        height: undefined
      }}
      className={className}
      decoding="async"
      fill={true}
      loading={loading}
      sizes={sizes}
      data-testid={dataTestId}
    />
  );
};

export default ContentfulImage;
