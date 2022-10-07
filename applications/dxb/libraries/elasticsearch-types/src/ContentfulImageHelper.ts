import { ContentfulImage } from "./types";

export const createFullyPopulatedContenfulImage = (
  contentfulImage?: Partial<ContentfulImage>
): ContentfulImage => ({
  ...createContentfulImage(),
  type: "Decorative",
  focalPoint: {
    x: 0,
    y: 0
  },
  ...contentfulImage
});

const createContentfulImage = (
  contentfulImage?: Partial<ContentfulImage>
): ContentfulImage => ({
  altText: "contentful image alt text",
  image: {
    file: {
      fileName: "image-filname.jpg",
      url: "http://localhost:9000/image-filname.jpg"
    }
  },
  title: "contentful image title",
  ...contentfulImage
});

export default createContentfulImage;
