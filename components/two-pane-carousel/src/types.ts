import { ClickableAction } from "@bmi/anchor-link";
import { AcceptedNode } from "@bmi/media";

export type Slide = {
  brandIcon?: SVGImport;
  title: React.ReactNode;
  description?: React.ReactNode;
  cta?: {
    label: React.ReactNode;
    action?: ClickableAction;
  };
  /**
   * @deprecated Use `media` instead.
   */
  imageSource?: string;
  media?: React.ReactElement<AcceptedNode>;
};

export type Props = {
  slides: Slide[];
};
