import AlertBanner from "@bmi-digital/components/alert-banner";
import { microCopy } from "@bmi/microcopies";
import React from "react";
import { useSiteContext } from "../../../components/Site";

export const DownloadListAlertBanner = () => {
  const { getMicroCopy } = useSiteContext();
  return (
    <AlertBanner severity="info">
      <AlertBanner.Title>
        {getMicroCopy(microCopy.DOWNLOAD_LIST_INFO_TITLE)}
      </AlertBanner.Title>
      {getMicroCopy(microCopy.DOWNLOAD_LIST_INFO_MESSAGE)}
    </AlertBanner>
  );
};
