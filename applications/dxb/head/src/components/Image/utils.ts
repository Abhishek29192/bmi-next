import { Props } from "./types";
import type { Props as ContentfulImageProps } from "./contentful-image/types";

export const isContentfulImage = (
  props: Props
): props is ContentfulImageProps =>
  "__typename" in props && props.__typename === "ContentfulImage";
