import {
  getMicroCopy as getMicroCopyOld,
  MicroCopyContext
} from "@bmi-digital/components";
import React from "react";
import { useSiteContext } from "../../Site";

export const useMicroCopy = () => {
  const copy = React.useContext(MicroCopyContext);
  const { getMicroCopy: getMicroCopyNew } = useSiteContext();
  const getMicroCopyOldWrapper = React.useCallback(
    (
      path: string,
      placeholders?: Record<string, string>,
      prefixMC?: boolean
    ) => {
      return getMicroCopyOld(copy, path, placeholders, prefixMC);
    },
    [copy]
  );

  const getMicroCopy =
    process.env.GATSBY_ENABLE_V2_WEBTOOLS_VISUALISATOR === "true"
      ? getMicroCopyNew
      : getMicroCopyOldWrapper;

  return {
    getMicroCopy
  };
};
