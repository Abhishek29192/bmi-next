import { AcceptedNode } from "@bmi/media";

export type Image = {
  /**
   * @deprecated Use `media` instead.
   */
  mainSource?: string;
  media?: React.ReactElement<AcceptedNode>;
  thumbnail?: string;
  /**
   * @deprecated The media itself should have the alternative text.
   */
  altText?: string;
};
