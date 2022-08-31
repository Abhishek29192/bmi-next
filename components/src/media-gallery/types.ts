import React from "react";
import { AcceptedNode } from "../media/Media";

export type Media = {
  media?: React.ReactElement<AcceptedNode>;
  thumbnail?: string;
  caption?: string;
  altText?: string;
  isVideo?: boolean;
  visualiserParameters?: Record<string, string | number>;
  openVisualiser?: (params?: Record<string, unknown>) => void;
};

export type ThumbnailsProps = {
  media: readonly Media[];
  /** The index to identify the active thumbnail */
  activeImageIndex: number;
  onThumbnailClick: (e: Event, index: number) => void;
  component?: React.ComponentType<any>; // TODO
  openYoutubeVideo?: (e: React.MouseEvent<SVGElement>, index: number) => void;
};
