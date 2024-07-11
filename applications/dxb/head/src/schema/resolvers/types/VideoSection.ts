import type { Data as VideoSectionData } from "../../../components/VideoSection";
import type { Video as ContentfulVideo } from "./Video";
import type { ContentfulRichText } from "./RichText";

export type ContentfulVideoSectionData = Omit<
  VideoSectionData,
  "video" | "description"
> & {
  video: ContentfulVideo;
  description: ContentfulRichText | null;
};
