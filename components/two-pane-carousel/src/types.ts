import { ClickableAction } from "@bmi/anchor-link";
import { AcceptedNode } from "@bmi/media";
import { SVGImport } from "@bmi/svg-import";

export type Slide = {
  brandIcon?: SVGImport;
  title: React.ReactNode;
  description?: React.ReactNode;
  cta?: {
    label: React.ReactNode;
    action?: ClickableAction;
  };
  media?: React.ReactElement<AcceptedNode>;
};

export type Props = {
  slides: Slide[];
};
