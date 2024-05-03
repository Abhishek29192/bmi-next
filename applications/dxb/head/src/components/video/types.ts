import type { Layout } from "@bmi-digital/components/youtube-video";
import type { Data as ContentfulImageData } from "../image/contentful-image/types";

export type Data = {
  title: string | null;
  label: string;
  subtitle: string | null;
  videoUrl: string;
  previewMedia: ContentfulImageData | null;
  videoRatio: { width: number; height: number } | null;
  defaultYouTubePreviewImage: string;
  layout?: Layout;
  className?: string;
  "data-testid"?: string;
};

export type ContentfulVideoData = Data & {
  __typename: "ContentfulVideo";
};
