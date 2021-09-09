import deepMerge from "lodash/merge";
import { MediaFolder } from "@bmi/intouch-api-types";

export const generateMediaFolder = (
  folder?: Partial<MediaFolder>
): MediaFolder => {
  return deepMerge(defaultMockFolder, folder);
};

const defaultMockFolder = {
  __typename: "MediaFolder",
  sys: {
    id: "2RdhIZRj7BuTDbC2eO2vQp"
  },
  contentfulMetadata: {},
  name: "Gallery",
  childrenCollection: {
    total: 2,
    items: [
      {
        __typename: "MediaTool",
        sys: {
          id: "5KGuESJm1OLfhEkSP9HfTD"
        },
        name: "Toscana Warisan - Black Glazed"
      },
      {
        __typename: "MediaTool",
        sys: {
          id: "2TmnqXhVdDMIb4RoY4Xqiv"
        },
        name: "Legacy Mineral - Silverstone Grey"
      }
    ]
  }
};
