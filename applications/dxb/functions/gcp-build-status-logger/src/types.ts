export enum BuildStatusType {
  BUILD_STARTED = "BUILD_STARTED",
  BUILD_SUCCEEDED = "BUILD_SUCCEEDED",
  BUILD_FAILED = "BUILD_FAILED",
  BUILD_TIMED_OUT = "BUILD_TIMED_OUT",
  PREVIEW_SUCCEEDED = "PREVIEW_SUCCEEDED",
  PREVIEW_FAILED = "PREVIEW_FAILED",
  PREVIEW_TIMED_OUT = "PREVIEW_TIMED_OUT"
}

export type GatsbyLog = {
  body: string;
  buildId: string;
  workspaceName: string;
  siteName: string;
  deployPreviewUrl: string;
  logsUrl: string;
  duration: string;
  resourceId: string;
  resourceType: string;
  event: BuildStatusType;
};
