import NextImage from "next/image";
import type { CustomImageProps } from "@bmi-digital/components/dist/media/types";
import type { Props } from "./types";

const createGenericImageProps = ({
  src,
  size,
  altText,
  loading = "lazy",
  ...props
}: Props): CustomImageProps => {
  return {
    component: NextImage,
    alt: altText,
    draggable: false,
    decoding: "async",
    loading,
    src,
    ...props
  };
};

export default createGenericImageProps;
