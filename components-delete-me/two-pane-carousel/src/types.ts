import { ClickableAction } from "@bmi-digital/components";
import { AcceptedNode } from "@bmi-digital/components";
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
