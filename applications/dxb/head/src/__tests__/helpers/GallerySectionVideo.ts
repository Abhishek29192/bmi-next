import { GallerySectionVideo } from "../../utils/media";

const createGallerySectionVideo = (
  gallerySectionVideo?: Partial<GallerySectionVideo>
): GallerySectionVideo => ({
  __typename: "Video",
  title: "featuredVideo",
  label: "label",
  subtitle: "ContentfulVideoSubtitle",
  videoUrl: "https://youtu.be/01SUXJmB9Ik",
  previewMedia: {
    __typename: "Image",
    title: "Title",
    altText: "ContentfulVideoAltText",
    type: "Descriptive",
    image: {
      fileName: "fileName",
      contentType: "image/jpeg",
      url: "http://localhost:8080/custom-image.jpg",
      size: 1000,
      height: 200,
      width: 400
    },
    focalPoint: { x: 0, y: 0 }
  },
  defaultYouTubePreviewImage:
    "https://i.ytimg.com/vi/01SUXJmB9Ik/maxresdefault.jpg",
  videoRatio: { width: 16, height: 9 },
  ...gallerySectionVideo
});

export default createGallerySectionVideo;
