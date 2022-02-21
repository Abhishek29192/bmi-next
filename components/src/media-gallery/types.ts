import React from "react";
import { AcceptedNode } from "../media/Media";

export type Media = {
  media?: React.ReactElement<AcceptedNode>;
  thumbnail?: string;
  caption?: string;
  altText?: string;
  isVideo?: boolean;
};
