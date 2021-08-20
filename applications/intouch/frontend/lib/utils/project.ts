import { Project } from "@bmi/intouch-api-types";
import { GetProjectQuery } from "../../graphql/generated/operations";
import { DeepPartial } from "./types";
import {
  GuaranteeStatus,
  guaranteePrerequsitesMet,
  guaranteeSolutionGuaranteeValidate
} from "./guarantee";

export enum ProjectStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  COMPLETED = "Completed"
}

export const getProjectStatus = (startDate, endDate) => {
  const now = Date.now();
  startDate = new Date(startDate).getTime();
  endDate = new Date(endDate).getTime();

  // Start date in the future
  if (startDate > now) {
    return ProjectStatus.NOT_STARTED;
  }

  // End date in the past
  if (endDate < now) {
    return ProjectStatus.COMPLETED;
  }

  // now between start and end date
  if (startDate <= now && now <= endDate) {
    return ProjectStatus.IN_PROGRESS;
  }

  // TODO: Invalid, log it?
  return ProjectStatus.NOT_STARTED;
};

export const getProjectGuaranteeStatus = (
  project: DeepPartial<Project>
): GuaranteeStatus => {
  const guarantee = project?.guarantees?.nodes?.[0];

  // Guarantee associated with the Project - Not Applicable
  if (!guarantee) {
    return "NOT_APPLICABLE";
  }

  if (guarantee.status === "NEW") {
    return guaranteePrerequsitesMet(guarantee) ? "READY" : "STARTED";
  }

  // Other known statuses are handled in microcopy, with a fallback:
  return ["SUBMITTED", "REVIEW", "REJECTED", "APPROVED"].includes(
    guarantee.status
  )
    ? guarantee.status
    : "NOT_APPLICABLE";
};

export const checkProjectGuaranteeReview = (
  project: GetProjectQuery["project"]
): boolean => {
  const solutionGuaranteeValidationResult =
    guaranteeSolutionGuaranteeValidate(project);

  return solutionGuaranteeValidationResult.isValid;
};
