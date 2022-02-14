import React from "react";
import { AcceptedNode } from "@bmi-digital/components/media";

export type Media = {
  media?: React.ReactElement<AcceptedNode>;
  thumbnail?: string;
  caption?: string;
  altText?: string;
  isVideo?: boolean;
};
