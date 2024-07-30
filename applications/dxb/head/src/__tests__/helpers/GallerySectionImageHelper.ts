import { GallerySectionImage } from "../../utils/media";

const createGallerySectionImage = (
  gallerySectionImage?: Partial<GallerySectionImage>
): GallerySectionImage => ({
  __typename: "Image",
  title: "Title",
  altText: "alt text",
  type: "Decorative",
  image: {
    fileName: "Lorem ipsum",
    contentType: "image/jpeg",
    url: "http://localhost:8080/custom-image.jpg",
    size: 1000,
    height: 200,
    width: 400
  },
  caption: {
    caption: "CAPTION"
  },
  focalPoint: { x: 0, y: 0 },
  ...gallerySectionImage
});

export default createGallerySectionImage;
