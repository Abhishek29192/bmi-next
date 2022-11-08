import { generateDigestFromData } from "../../../../libraries/utils/src/encryption";
import { Context, Node, ResolveArgs } from "./types/Gatsby";

interface FieldData {
  id: string;
  tileId: number;
  colourId: number;
  sidingId: number;
  viewMode: string;
}

const getNumberValue = (value: string) => {
  const parsedValue = parseFloat(value);

  if (isNaN(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
};

const getViewMode = (value: string | number = 0) => {
  const availableModes = ["tile", "roof"];

  if (typeof value === "string" && availableModes.includes(value)) {
    return value;
  }

  return availableModes[parseInt(value.toString())] || availableModes[0];
};

const getNodeData = (parentId: string, fieldData: FieldData) => ({
  ...fieldData,
  parent: parentId,
  children: [],
  internal: {
    type: "ContentfulLinkParametersJsonNode",
    owner: "@bmi/resolvers",
    contentDigest: generateDigestFromData(fieldData)
  }
});

export default {
  parameters: {
    type: "ContentfulLinkParametersJsonNode",
    async resolve(source: Node, args: ResolveArgs, context: Context) {
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
