import { ClickableAction } from "@bmi/anchor-link";

export type Slide = {
  brandIcon?: SVGImport;
  title: React.ReactNode;
  children?: React.ReactNode;
  CTA?: {
    label: React.ReactNode;
    action?: ClickableAction;
  };
  imageSource: string;
};

export type Props = {
  slides: Slide[];
};
