import type { Props as ContentfulImageProps } from "./contentful-image/types";
import type { Props as GenericImageProps } from "./generic-image/types";

export type Props = ContentfulImageProps | GenericImageProps;

export type ImageWidths = [number, number, number, number, number];
