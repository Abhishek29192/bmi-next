import {
  GuaranteeEventType,
  Project,
  RequestStatus
} from "@bmi/intouch-api-types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { GetProjectQuery } from "../../graphql/generated/operations";
import { DeepPartial } from "./types";
import { GuaranteeStatus, guaranteePrerequsitesMet } from "./guarantee";

dayjs.extend(isBetween);

export enum ProjectStatus {
  NOT_STARTED = "filters.labels.NOT_STARTED",
  IN_PROGRESS = "filters.labels.IN_PROGRESS",
  COMPLETED = "filters.labels.COMPLETED"
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

export const findProjectGuarantee = (project: DeepPartial<Project>) => {
  return project?.guarantees?.nodes?.[0];
};

export const getProjectGuaranteeStatus = (
  project: DeepPartial<Project>
): GuaranteeStatus => {
  const guarantee = findProjectGuarantee(project);

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

export const getGuaranteeEventType = (
  project: DeepPartial<Project>,
  accountId: number
): GuaranteeEventType => {
  const guarantee = project?.guarantees?.nodes?.[0];

  if (!guarantee || !["SUBMITTED", "REVIEW"].includes(guarantee.status)) {
    return null;
  }

  if (guarantee.status === "SUBMITTED") return "ASSIGN_SOLUTION";
  if (guarantee.status === "REVIEW") {
    if (guarantee.reviewerAccountId !== accountId) {
      return "REASSIGN_SOLUTION";
    }
    return "UNASSIGN_SOLUTION";
  }
};
export const isProjectApprovable = (
  project: DeepPartial<Project>,
  accountId: number
): boolean => {
  const guarantee = project?.guarantees?.nodes?.[0];

  if (!guarantee) {
    return false;
  }

  return (
    guarantee.status === "REVIEW" && guarantee.reviewerAccountId === accountId
  );
};

export const isProjectEditable = (project) => {
  const guarantee = findProjectGuarantee(project);

  // If there is no guarantee, all fields can be edited
  if (!guarantee) {
    return true;
  }

  // If there is a guarantee, some fields can be edited, if it's in certain statuses
  return !["APPROVED", "SUBMITTED", "REVIEW"].includes(guarantee.status);
};

export const isSolutionOrSystemGuaranteeExist = (
  project: GetProjectQuery["project"]
) => {
  return project.guarantees.nodes.some((guarantee) =>
    ["SOLUTION", "SYSTEM"].includes(guarantee.coverage)
  );
};

export const getGuaranteeStatus = (
  project: GetProjectQuery["project"]
): RequestStatus => {
  const guarantee = project.guarantees.nodes?.[0];

  return guarantee?.status;
};

export const getProjectDaysRemaining = (startDate, endDate) => {
  const now = Date.now();
  startDate = new Date(startDate).getTime();
  endDate = new Date(endDate).getTime();

  // Start date in the future
  if (dayjs(startDate).isAfter(now)) {
    return dayjs(endDate).diff(startDate, "day");
  }
  // End date in the past
  if (dayjs(endDate).isBefore(now)) {
    return 0;
  }
  // now between start and end date
  if (dayjs(now).isBetween(startDate, endDate)) {
    return dayjs(endDate).diff(now, "day");
  }

  return 0;
};

export const getProjectCertifiedInstallers = (
  project: GetProjectQuery["project"]
) => {
  if (project.projectMembers.nodes.length === 0) {
    return 0;
  }

  const certificatedInstallers = project.projectMembers.nodes.filter((member) =>
    member.account?.certificationsByDoceboUserId?.nodes?.some(
      (certificate) => certificate.technology === project.technology
    )
  );

  return certificatedInstallers.length;
};
