import createAsset, { createFullyPopulatedAsset } from "./assetHelper";
import { Image } from "./types";

export const createFullyPopulatedImage = (
  contentfulImage?: Partial<Image>
): Image => ({
  ...createImage(),
  caption: "caption",
  focalPoint: {
    focalPoint: {
      x: 0,
      y: 0
    }
  },
  image: createFullyPopulatedAsset(),
  type: "Decorative",
  ...contentfulImage
});

const createImage = (contentfulImage?: Partial<Image>): Image => ({
  altText: "image alt text",
  image: createAsset(),
  title: "image title",
  ...contentfulImage
});

export default createImage;
