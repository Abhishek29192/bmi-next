import resolveRichText from "./ContentfulRichText";
import resolveVideo from "./ContentfulVideo";
import type { Data as VideoSectionData } from "../../components/VideoSection";
import type { ContentfulVideoSectionData } from "./types/VideoSection";

const resolveVideoSection = async ({
  description,
  video,
  ...rest
}: ContentfulVideoSectionData): Promise<VideoSectionData> => ({
  ...rest,
  video: await resolveVideo(video),
  description: description ? await resolveRichText(description) : null
});

export default resolveVideoSection;
