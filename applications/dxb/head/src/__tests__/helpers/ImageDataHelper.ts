import createGatsbyImageData from "./GatsbyImageDataHelper";
import type { Data as ImageData } from "../../components/image/types";

const createImageData = (imageData?: Partial<ImageData>): ImageData => ({
  altText: "Image alt text",
  type: "Decorative",
  image: {
    file: {
      fileName: "custom-image.jpg"
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
