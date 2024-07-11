import createContentfulVideo from "./ContetfulVideoHelper";
import createContentfulRichText from "./ContentfulRichText";
import type { ContentfulVideoSectionData } from "../VideoSection";

const createContentfulVideoSection = (
  videoSection?: Partial<ContentfulVideoSectionData>
): ContentfulVideoSectionData => ({
  __typename: "VideoSection",
  name: "Name",
  title: "Title",
  video: createContentfulVideo(),
  description: createContentfulRichText(),
  ...videoSection
});

export default createContentfulVideoSection;
