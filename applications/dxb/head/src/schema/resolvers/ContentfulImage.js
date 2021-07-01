"use strict";

const getFocalPoint = (size, position) =>
  parseFloat(((100 * position) / size).toFixed(0));

module.exports = {
  focalPoint: {
    type: `FocalPoint`,
    async resolve(source, args, context) {
      if (!source.image___NODE || !source.focalPoint___NODE) {
        return null;
      }

      const image = await context.nodeModel.getNodeById({
        id: source.image___NODE,
        type: "ContentfulAsset"
      });

      const { focalPoint } = await context.nodeModel.getNodeById({
        id: source.focalPoint___NODE,
        type: "contentfulImageFocalPointJsonNode"
      });

      const { width, height } = image.file.details.image;

      if (!focalPoint) {
        return null;
      }

      return {
        x: getFocalPoint(width, focalPoint.x),
        y: getFocalPoint(height, focalPoint.y)
      };
    }
  }
};