"use strict";

const { generateDigestFromData } = require("../../utils/encryption");

const getNumberValue = (value) => {
  const parsedValue = parseFloat(value);

  if (isNaN(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
};
const getViewMode = (value = 0) => {
  const availableModes = ["tile", "roof"];

  if (availableModes.includes(value)) {
    return value;
  }

  // eslint-disable-next-line security/detect-object-injection
  return availableModes[value] || availableModes[0];
};

const getNodeData = (parentId, fieldData) => ({
  ...fieldData,
  parent: parentId,
  children: [],
  internal: {
    type: "contentfulLinkParametersJsonNode",
    owner: "@bmi/resolvers",
    contentDigest: generateDigestFromData(fieldData)
  }
});

module.exports = {
  parameters: {
    type: "contentfulLinkParametersJsonNode",
    async resolve(source, args, context) {
      if (!source.parameters___NODE) {
        return null;
      }

      const parameters = await context.nodeModel.getNodeById({
        id: source.parameters___NODE
      });

      if (source.type === "Visualiser") {
        const { tileId, colourId, sidingId, viewMode } = parameters;

        return getNodeData(source.id, {
          id: source.parameters___NODE,
          tileId: getNumberValue(tileId),
          colourId: getNumberValue(colourId),
          sidingId: getNumberValue(sidingId),
          viewMode: getViewMode(viewMode)
        });
      }

      return null;
    }
  }
};
