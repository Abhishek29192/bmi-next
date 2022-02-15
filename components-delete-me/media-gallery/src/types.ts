import React from "react";
import { AcceptedNode } from "@bmi-digital/components";

export type Media = {
  media?: React.ReactElement<AcceptedNode>;
  thumbnail?: string;
  caption?: string;
  altText?: string;
  isVideo?: boolean;
};
