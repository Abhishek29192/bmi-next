import type { Data as ImageData } from "../../components/image/contentful-image/types";

const getFocalPoint = (size: number, position: number) =>
  parseFloat(((100 * position) / size).toFixed(0));

const resolveImage = (image: ImageData): ImageData => {
  if (!image.focalPoint) {
    return image;
  }

  const { focalPoint, ...rest } = image;

  return {
    ...rest,
    focalPoint: {
      x: getFocalPoint(image.image.width, focalPoint.x),
      y: getFocalPoint(image.image.height, focalPoint.y)
    }
  };
};

export default resolveImage;
