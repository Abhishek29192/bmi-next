import { Data as ImageData } from "../../components/image/contentful-image/types";

const createImageData = (imageData?: Partial<ImageData>): ImageData => ({
  __typename: "ContentfulImage",
  altText: "Alt text",
  title: "Test image",
  image: {
    file: {
      fileName: "custom-image.jpg",
      contentType: "image/jpeg",
      url: "http://localhost:8080/custom-image.jpg",
      details: {
        size: 1000,
        image: {
          height: 200,
          width: 400
        }
      }
    }
  },
  focalPoint: {
    x: 0,
    y: 0
  },
  type: "Decorative",
  ...imageData
});

export default createImageData;
