import { GallerySectionImage } from "../../utils/media";
import createGatsbyImageData from "./GatsbyImageDataHelper";

const createGallerySectionImage = (
  gallerySectionImage?: Partial<GallerySectionImage>
): GallerySectionImage => ({
  __typename: "Image",
  altText: "alt text",
  type: "Decorative",
  image: {
    gatsbyImageData: createGatsbyImageData(),
    thumbnail: createGatsbyImageData(),
    file: {
      fileName: "Lorem ipsum"
    }
  },
  caption: {
    caption: "CAPTION"
  },
  focalPoint: { x: 0, y: 0 },
  ...gallerySectionImage
});

export default createGallerySectionImage;
