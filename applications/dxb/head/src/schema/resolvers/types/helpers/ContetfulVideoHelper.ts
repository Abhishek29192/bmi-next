import createImageData from "../../../../__tests__/helpers/ImageDataHelper";
import type { Video as ContentfulVideo } from "../../types/Video";

const createContentfulVideoData = (
  video?: Partial<ContentfulVideo>
): ContentfulVideo => ({
  __typename: "Video",
  title: "Video title",
  label: "Video label",
  subtitle: "Video subtitle",
  previewMedia: createImageData(),
  youtubeId: "YouTube-id",
  ...video
});

export default createContentfulVideoData;
