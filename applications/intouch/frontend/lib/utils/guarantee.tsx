import React from "react";
import {
  RequestStatus,
  Technology,
  ContentfulTiers,
  Tier
} from "@bmi/intouch-api-types";
import Check from "@material-ui/icons/Check";
import Warning from "@material-ui/icons/Warning";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import { GetProjectQuery } from "../../graphql/generated/operations";

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
  SUBMITTED: <WatchLaterIcon style={{ color: "#009fe3" }} />,
  REVIEW: <WatchLaterIcon style={{ color: "#009fe3" }} />,
  REJECTED: <Warning style={{ color: "red" }} />,
  APPROVED: <Check style={{ color: "green" }} />
};

export enum SolutionGuaranteeValidationError {
  NoGuaranteeType,
  InvalidStatus,
  EvidenceNotMet,
  NoResponsibleInstaller,
  NoValidCertification,
  InvalidTier,
  BuildingOwnerIncomplete,
  ProjectDetailIncomplete
}
export const SolutionGuaranteeValidationErrorMessage: Record<
  SolutionGuaranteeValidationError,
  string
> = {
  [SolutionGuaranteeValidationError.NoGuaranteeType]:
    "guaranteeSubmitAlert.message.guaranteeType",
  [SolutionGuaranteeValidationError.InvalidStatus]:
    "guaranteeSubmitAlert.message.notApplicable",
  [SolutionGuaranteeValidationError.EvidenceNotMet]:
    "guaranteeSubmitAlert.message.minumumEvidence",
  [SolutionGuaranteeValidationError.NoResponsibleInstaller]:
    "guaranteeSubmitAlert.message.responsibleInstaller",
  [SolutionGuaranteeValidationError.NoValidCertification]:
    "guaranteeSubmitAlert.message.certification",
  [SolutionGuaranteeValidationError.InvalidTier]:
    "guaranteeSubmitAlert.message.tier",
  [SolutionGuaranteeValidationError.BuildingOwnerIncomplete]:
    "guaranteeSubmitAlert.message.buildingOwner",
  [SolutionGuaranteeValidationError.ProjectDetailIncomplete]:
    "guaranteeSubmitAlert.message.projectDetails"
};

// TODO:
export const guaranteePrerequsitesMet = (guarantee) => true;

type SolutionGuaranteeValidateResult = {
  isValid: boolean;
  validationError?: SolutionGuaranteeValidationError;
};
export const solutionGuaranteeValidate = (
  project: GetProjectQuery["project"]
): SolutionGuaranteeValidateResult => {
  const guarantee = project?.guarantees?.nodes?.[0];

  if (guarantee?.coverage === "SOLUTION") {
    if (!guarantee?.guaranteeType) {
      return {
        isValid: false,
        validationError: SolutionGuaranteeValidationError.NoGuaranteeType
      };
    }
    if (!["NEW", "REJECTED"].includes(guarantee.status)) {
      return {
        isValid: false,
        validationError: SolutionGuaranteeValidationError.InvalidStatus
      };
    }

    const { guaranteeType } = guarantee;
    const { projectMembers, technology, company, evidenceItems } = project;

    const isTierAvailable = checkCompanyTier(
      [...guaranteeType.tiersAvailable],
      company.tier
    );
    if (!isTierAvailable) {
      return {
        isValid: false,
        validationError: SolutionGuaranteeValidationError.InvalidTier
      };
    }
    const isProjectDetailsCompleted = checkProjectDetail(project);
    if (!isProjectDetailsCompleted) {
      return {
        isValid: false,
        validationError:
          SolutionGuaranteeValidationError.ProjectDetailIncomplete
      };
    }

    const isBuildingOwnerCompleted = checkBuildingOwner(project);
    if (!isBuildingOwnerCompleted) {
      return {
        isValid: false,
        validationError:
          SolutionGuaranteeValidationError.BuildingOwnerIncomplete
      };
    }

    const isEvidenceUploaded = checkEvidence(
      evidenceItems?.nodes,
      guaranteeType.evidenceCategoriesCollection.items
    );
    if (!isEvidenceUploaded) {
      return {
        isValid: false,
        validationError: SolutionGuaranteeValidationError.EvidenceNotMet
      };
    }

    const responsibleInsalller = getResponsibleInsalller(projectMembers.nodes);
    if (!responsibleInsalller) {
      return {
        isValid: false,
        validationError: SolutionGuaranteeValidationError.NoResponsibleInstaller
      };
    }

    const isCertificationAvailable = checkCertification(
      responsibleInsalller,
      technology
    );
    if (!isCertificationAvailable) {
      return {
        isValid: false,
        validationError: SolutionGuaranteeValidationError.NoValidCertification
      };
    }
  }

  return {
    isValid: true
  };
};
export const guaranteeApplicationValidate = (
  project: GetProjectQuery["project"]
) => {
  if (!checkProjectDetail(project)) {
    return {
      isValid: false,
      validationError: "guaranteeApplyAlert.message.projectDetails"
    };
  }

  if (!checkBuildingOwner(project)) {
    return {
      isValid: false,
      validationError: "guaranteeApplyAlert.message.buildingOwner"
    };
  }
  const { company, guarantees } = project;

  if (guarantees.nodes.length === 0) {
    return {
      isValid: true,
      validationError: null
    };
  }

  const guarantee = guarantees.nodes[0];
  const { guaranteeType } = guarantee;

  if (!guaranteeType) {
    return {
      isValid: false,
      validationError: "guaranteeApplyAlert.message.guaranteeType"
    };
  }
  if (!checkCompanyTier([...guaranteeType.tiersAvailable], company?.tier)) {
    return {
      isValid: false,
      validationError: "guaranteeApplyAlert.message.tier"
    };
  }

  return {
    isValid: true,
    validationError: null
  };
};

const checkEvidence = (
  guaranteEvidenceItems: GetProjectQuery["project"]["evidenceItems"]["nodes"] = [],
  //TODO: Find an alternative way to define parameter type.
  evidenceCategories: GetProjectQuery["project"]["guarantees"]["nodes"][0]["guaranteeType"]["evidenceCategoriesCollection"]["items"]
) => {
  for (const { referenceCode, minimumUploads } of evidenceCategories.filter(
    Boolean
  )) {
    const uploadedFileCount = guaranteEvidenceItems.filter(
      (e) => e.customEvidenceCategoryKey === referenceCode
    ).length;

    if (uploadedFileCount < minimumUploads) return false;
  }

  return true;
};

const getResponsibleInsalller = (
  projectMembers: GetProjectQuery["project"]["projectMembers"]["nodes"]
) => {
  return projectMembers.find((member) => member.isResponsibleInstaller);
};

const checkCertification = (
  projectMember: GetProjectQuery["project"]["projectMembers"]["nodes"][0],
  technology: Technology
) => {
  return projectMember.account.certificationsByDoceboUserId.nodes.some(
    (certification) => certification.technology === technology
  );
};

const checkCompanyTier = (availableTiers: ContentfulTiers[], tier: Tier) => {
  return availableTiers.includes(tier);
};

const checkBuildingOwner = ({
  buildingOwnerMail,
  buildingOwnerFirstname,
  buildingOwnerLastname,
  buildingOwnerAddress
}: GetProjectQuery["project"]) => {
  return [
    buildingOwnerMail,
    buildingOwnerFirstname,
    buildingOwnerLastname,
    buildingOwnerAddress
  ].every(Boolean);
};

const checkProjectDetail = ({
  name,
  siteAddress,
  technology,
  roofArea,
  startDate,
  endDate
}: GetProjectQuery["project"]) => {
  return [name, siteAddress, technology, roofArea, startDate, endDate].every(
    Boolean
  );
};
