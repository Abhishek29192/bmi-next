import { GalleryPimVideo } from "../../utils/media";

const createGalleryPimVideo = (
  galleryPimVideo?: Partial<GalleryPimVideo>
): GalleryPimVideo => ({
  __typename: "PimVideo",
  videoUrl: "https://www.youtube.com/watch?v=AGVIbPFLDcI",
  title: "PimVideoTitle",
  label: "PimVideoLabel",
  subtitle: "subtitle",
  previewMedia: null,
  videoRatio: null,
  defaultYouTubePreviewImage:
    "https://i.ytimg.com/vi/AGVIbPFLDcI/maxresdefault.jpg",
  ...galleryPimVideo
});

export default createGalleryPimVideo;
