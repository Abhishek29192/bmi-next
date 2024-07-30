import NextImage from "next/image";
import { Props as VideoProps } from "../../components/video/Video";
import createImageData from "./ImageDataHelper";
import type { ContentfulVideoData } from "../../components/video/types";

const createVideoData = (
  video?: Partial<ContentfulVideoData>
): ContentfulVideoData => ({
  __typename: "Video",
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

export const createVideoProps = (video?: Partial<VideoProps>): VideoProps => ({
  title: "Video title",
  label: "Video label",
  subtitle: "Video subtitle",
  videoUrl: "http://localhost:8080/video.mp4",
  videoRatio: { width: 16, height: 9 },
  defaultYouTubePreviewImage: "http://localhost:8080/default-image.jpg",
  layout: "inline",
  previewMedia: {
    component: NextImage,
    src: "http://localhost:8080/image.png",
    width: 100,
    height: 100,
    alt: "Alt text",
    style: {
      objectFit: "cover",
      objectPosition: "center"
    },
    focalPoint: {
      x: 100,
      y: 1000
    }
  },
  ...video
});

export default createVideoData;
