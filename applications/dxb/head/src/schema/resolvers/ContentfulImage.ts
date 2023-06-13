import type { Context, Node, ResolveArgs } from "./types/Gatsby";

const getFocalPoint = (size: number, position: number) =>
  parseFloat(((100 * position) / size).toFixed(0));

export default {
  focalPoint: {
    type: `FocalPoint`,
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      if (!source.image___NODE || !source.focalPoint___NODE) {
        return null;
      }

      const image = await context.nodeModel.getNodeById({
        id: source.image___NODE,
        type: "ContentfulAsset"
      });

      if (!image?.file?.details?.image) {
        return null;
      }

      const focalPoint = await context.nodeModel.getNodeById({
        id: source.focalPoint___NODE,
        type: "contentfulImageFocalPointJsonNode"
      });

      if (!focalPoint?.focalPoint?.x || !focalPoint?.focalPoint?.y) {
        return null;
      }

      const { width, height } = image.file.details.image;
      const { x: focalPointX, y: focalPointY } = focalPoint.focalPoint;

      return {
        x: getFocalPoint(width, focalPointX),
        y: getFocalPoint(height, focalPointY)
      };
    }
  }
};
