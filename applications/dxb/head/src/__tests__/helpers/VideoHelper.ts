import { ContentfulVideoData } from "../../components/Video";
import createImageData from "./ImageDataHelper";

const createVideoData = (
  video?: Partial<ContentfulVideoData>
): ContentfulVideoData => ({
  __typename: "ContentfulVideo",
  title: "Video title",
  label: "Video label",
  subtitle: "Video subtitle",
  videoUrl: "http://localhost:8080/video.mp4",
  previewMedia: createImageData(),
  videoRatio: { width: 16, height: 9 },
  defaultYouTubePreviewImage: "http://localhost:8080/default-image.jpg",
  layout: "inline",
  ...video
});

export default createVideoData;
