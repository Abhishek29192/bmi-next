import { SVGImport } from "@bmi-digital/svg-import";
import { ClickableAction } from "../clickable/Clickable";
import { AcceptedNode } from "../media/Media";

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
