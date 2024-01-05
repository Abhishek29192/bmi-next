import { ImageLoaderProps } from "next/image";

export type Data = ImageLoaderProps & {
  height: number;
  altText: HTMLImageElement["alt"];
  type?: "Decorative" | "Descriptive" | null;
  focalPoint?: {
    x: number;
    y: number;
  } | null;
  loading?: HTMLImageElement["loading"];
};

export type Options = {
  className?: string;
  size?: "cover" | "contain";
  position?: string;
  isMobile?: boolean;
};

export type Props = Data & Options & { "data-testid"?: string };
