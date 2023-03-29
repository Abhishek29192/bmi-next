import { Data as ImageData } from "../../components/Image";
import createGatsbyImageData from "./GatsbyImageDataHelper";

const createImageData = (imageData?: Partial<ImageData>): ImageData => ({
  altText: "Image alt text",
  type: "Decorative",
  image: {
    file: {
      fileName: "custom-image.jpg",
      url: "http://localhost:8080/custom-image.jpg"
    },
    gatsbyImageData: createGatsbyImageData(),
    thumbnail: createGatsbyImageData()
  },
  focalPoint: {
    x: 0,
    y: 0
  },
  ...imageData
});

export default createImageData;
