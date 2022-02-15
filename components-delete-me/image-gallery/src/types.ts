import { AcceptedNode } from "@bmi-digital/components";

export type Image = {
  media?: React.ReactElement<AcceptedNode>;
  thumbnail?: string;
  /**
   * @deprecated The media itself should have the alternative text.
   */
  altText?: string;
  caption?: string;
};
