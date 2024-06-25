import type { GatsbyImageProps, IGatsbyImageData } from "gatsby-plugin-image";

type ImageData =
  | {
      file: {
        fileName: string;
        url?: never;
      };
      gatsbyImageData: IGatsbyImageData;
      thumbnail?: IGatsbyImageData;
    }
  | {
      file: {
        fileName: string;
        url: string;
      };
      gatsbyImageData?: never;
      thumbnail?: IGatsbyImageData;
    };

export type Data = {
  altText: string;
  type?: "Decorative" | "Descriptive" | null;
  image: ImageData;
  focalPoint?: {
    x: number;
    y: number;
  } | null;
  loading?: GatsbyImageProps["loading"];
};

export type Options = {
  className?: string;
  size?: "cover" | "contain";
  position?: string;
  isMobile?: boolean;
};

export type Props = Data & Options & { "data-testid"?: string };
