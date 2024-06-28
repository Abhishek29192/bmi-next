import NextImage from "next/image";
import React from "react";
import { Props } from "./types";

const createGenericImageProps = ({
  src,
  size,
  altText,
  loading = "lazy",
  ...props
}: Props) => {
  return (
    <NextImage
      alt={altText}
      draggable={false}
      decoding={"async"}
      loading={loading}
      src={src}
      {...(size && {
        style: {
          objectFit: size
        }
      })}
      {...props}
    />
  );
};

export default createGenericImageProps;
