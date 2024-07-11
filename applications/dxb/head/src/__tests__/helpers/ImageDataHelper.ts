import { Data as ImageData } from "../../components/image/contentful-image/types";

const createImageData = (imageData?: Partial<ImageData>): ImageData => ({
  __typename: "Image",
  altText: "Alt text",
  title: "Test image",
  image: {
    fileName: "custom-image.jpg",
    contentType: "image/jpeg",
    url: "http://localhost:8080/custom-image.jpg",
    size: 1000,
    height: 200,
    width: 400
  },
  focalPoint: {
    x: 0,
    y: 0
  },
  type: "Decorative",
  ...imageData
});

export default createImageData;
