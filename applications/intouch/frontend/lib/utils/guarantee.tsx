import React from "react";
import { RequestStatus } from "@bmi/intouch-api-types";
import Check from "@material-ui/icons/Check";
import Warning from "@material-ui/icons/Warning";
import WatchLaterIcon from "@material-ui/icons/WatchLater";

export type GuaranteeStatus =
  | Exclude<RequestStatus, "NEW">
  | "READY"
  | "STARTED"
  | "NOT_APPLICABLE";

export const guaranteeStatusIcons: Record<
  GuaranteeStatus,
  React.ReactElement | null
> = {
  NOT_APPLICABLE: null,
  STARTED: <Warning style={{ color: "orange" }} />,
  READY: <Check style={{ color: "green" }} />,
  SUBMITTED: <WatchLaterIcon style={{ color: "blue" }} />,
  REVIEW: <WatchLaterIcon style={{ color: "blue" }} />,
  REJECTED: <Warning style={{ color: "red" }} />,
  APPROVED: <Check style={{ color: "green" }} />
};

// TODO:
export const guaranteePrerequsitesMet = (guarantee) => true;
