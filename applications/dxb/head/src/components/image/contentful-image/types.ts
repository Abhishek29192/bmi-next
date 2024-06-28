import { ImageWidths } from "../types";

type ImageData = {
  file: {
    fileName: string;
    contentType:
      | "image/jpg"
      | "image/jpeg"
      | "image/png"
      | "image/webp"
      | "image/gif"
      | "image/svg+xml";
    url: string;
    details: {
      image: {
        width: number;
        height: number;
      };
      size: number;
    };
  };
};

export interface Data {
  __typename: "ContentfulImage";
  altText: string;
  image: ImageData;
  title: string;
  type?: "Decorative" | "Descriptive" | null;
  focalPoint?: {
    x: number;
    y: number;
  } | null;
}

export type Options = {
  className?: string;
  size?: "cover" | "contain";
  position?: string;
  isMobile?: boolean;
  loading?: "lazy" | "eager";
  "data-testid"?: string;
};

export type Props = Omit<Data, "image"> & {
  widths: ImageWidths;
  image: { file: { url: ImageData["file"]["url"] } };
} & Options;
