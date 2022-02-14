import { ClickableAction } from "@bmi-digital/components/anchor-link";
import { AcceptedNode } from "@bmi-digital/components/media";
import { SVGImport } from "@bmi-digital/svg-import";

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
