import { DataTypeEnum } from "../../components/link/types";
import { getUrlFromPath, resolvePath } from "./utils/path";
import resolveFormSection from "./ContentfulFormSection";
import type { ContentfulLink } from "./types/Link";
import type { Data as LinkData } from "../../components/link/types";

const getNumberValue = (value: unknown) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const parsedValue = parseFloat(value);

  if (isNaN(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
};

const getViewMode = (value: unknown = 0) => {
  const availableModes = ["tile", "roof"];

  if (typeof value !== "string" && typeof value !== "number") {
    return availableModes[0];
  }

  if (typeof value === "string" && availableModes.includes(value)) {
    return value;
  }

  return availableModes[parseInt(value.toString())] || availableModes[0];
};

const getParameters = (link: ContentfulLink): LinkData["parameters"] => {
  if (link.type === DataTypeEnum.Visualiser) {
    const { tileId, colourId, sidingId, viewMode } = link.parameters!;

    return {
      tileId: getNumberValue(tileId),
      colourId: getNumberValue(colourId),
      sidingId: getNumberValue(sidingId),
      viewMode: getViewMode(viewMode)
    };
  }

  return null;
};

const resolveLink = async (link: ContentfulLink): Promise<LinkData> => {
  const { linkedPage, dialogContent, parameters, sys, ...rest } = link;

  const linkedPagePath = linkedPage ? await resolvePath(linkedPage) : null;

  return {
    ...rest,
    id: sys.id,
    linkedPage: linkedPage ? { path: getUrlFromPath(linkedPagePath) } : null,
    parameters: parameters ? getParameters(link) : null,
    dialogContent: dialogContent
      ? await resolveFormSection(dialogContent)
      : null
  };
};

export default resolveLink;
