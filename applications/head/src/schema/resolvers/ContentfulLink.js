"use strict";

const { generateDigestFromData } = require("./utils/encryption");

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
    type: `contentfulLinkParametersJsonNode`,
    resolve(source) {
      if (!source.parameters) {
        return null;
      }

      if (source.type === "Visualiser") {
        const { tileId, colourId, sidingId, viewMode } = source.parameters;

        return getNodeData(source.id, {
          id: source.parameters.id,
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
