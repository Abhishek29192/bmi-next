import { GallerySectionVideo } from "../../utils/media";
import createGatsbyImageData from "./GatsbyImageDataHelper";

const createGallerySectionVideo = (
  gallerySectionVideo?: Partial<GallerySectionVideo>
): GallerySectionVideo => ({
  __typename: "ContentfulVideo",
  title: "featuredVideo",
  label: "label",
  subtitle: "ContentfulVideoSubtitle",
  videoUrl: "https://youtu.be/01SUXJmB9Ik",
  previewMedia: {
    altText: "ContentfulVideoAltText",
    type: "Descriptive",
    image: {
      gatsbyImageData: createGatsbyImageData(),
      thumbnail: createGatsbyImageData(),
      file: {
        fileName: "fileName"
      }
    },
    focalPoint: { x: 0, y: 0 }
  },
  defaultYouTubePreviewImage:
    "https://i.ytimg.com/vi/01SUXJmB9Ik/maxresdefault.jpg",
  videoRatio: { width: 16, height: 9 },
  ...gallerySectionVideo
});

export default createGallerySectionVideo;
