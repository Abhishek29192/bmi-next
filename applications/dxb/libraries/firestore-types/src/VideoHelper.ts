import { Video } from "./types";

const createVideo = (video?: Partial<Video>): Video => ({
  label: "name",
  previewMedia: null,
  subtitle: null,
  title: "",
  videoRatio: null,
  youtubeId: "3901c0ds7oo",
  ...video
});

export default createVideo;
