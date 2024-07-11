import type { ContentfulVideoData } from "../../../components/video/types";

export type Video = Pick<
  ContentfulVideoData,
  "__typename" | "title" | "label" | "subtitle" | "previewMedia"
> & {
  youtubeId: string;
};
