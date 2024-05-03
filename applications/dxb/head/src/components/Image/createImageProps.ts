import createContentfulImageProps from "./contentful-image/createContentfulImageProps";
import createGenericImageProps from "./generic-image/createGenericImageProps";
import { isContentfulImage } from "./utils";
import type { CustomImageProps } from "@bmi-digital/components/media";
import type { Props } from "./types";

const createImageProps = (props: Props): CustomImageProps => {
  if (isContentfulImage(props)) {
    return createContentfulImageProps(props);
  }
  return createGenericImageProps(props);
};

export default createImageProps;
