export interface Data {
  altText: string;
  src: string;
  width: number;
  height: number;
}

type Options = {
  className?: string;
  size?: "cover" | "contain";
  loading?: "lazy" | "eager";
  "data-testid"?: string;
};

export type Props = Data & Options;
