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
  SUBMITTED: <WatchLaterIcon style={{ color: "blue" }} />,
  REVIEW: <WatchLaterIcon style={{ color: "blue" }} />,
  REJECTED: <Warning style={{ color: "red" }} />,
  APPROVED: <Check style={{ color: "green" }} />
};

export enum SolutionGuaranteeValidationError {
  NoGuarantee,
  NotApplicable,
  MinumumEvidence,
  ResponsibleInstaller,
  Certification,
  Tier,
  BuilderOwner,
  ProjectDetail
}

type SolutionGuaranteeValidateResult = {
  isValid: boolean;
  validationError?: SolutionGuaranteeValidationError;
};

// TODO:
export const guaranteePrerequsitesMet = (guarantee) => true;

export const guaranteeSolutionGuaranteeValidate = (
  project: GetProjectQuery["project"]
): SolutionGuaranteeValidateResult => {
  const guarantee = project?.guarantees?.nodes?.[0];
  if (!guarantee) {
    return {
      isValid: false,
      validationError: SolutionGuaranteeValidationError.NoGuarantee
    };
  }
  if (!["NEW", "REJECTED"].includes(guarantee.status)) {
    return {
      isValid: false,
      validationError: SolutionGuaranteeValidationError.NotApplicable
    };
  }

  const { guaranteeType } = guarantee;
  const { projectMembers, technology, company, evidenceItems } = project;

  const isEvidenceUploaded = checkEvidence(
    evidenceItems?.nodes,
    guaranteeType.evidenceCategoriesCollection.items
  );
  if (!isEvidenceUploaded) {
    //The minimum number or Evidence Items has been uploaded for all the Evidence Categories that apply to the Guarantee Type
    return {
      isValid: false,
      validationError: SolutionGuaranteeValidationError.MinumumEvidence
    };
  }

  const responsibleInsalller = getResponsibleInsalller(projectMembers.nodes);
  if (!responsibleInsalller) {
    //TThere is a Responsible Installer nominated for the Project.
    return {
      isValid: false,
      validationError: SolutionGuaranteeValidationError.ResponsibleInstaller
    };
  }

  const isCertificationAvailable = checkCertification(
    responsibleInsalller,
    technology
  );
  if (!isCertificationAvailable) {
    //The nominated Responsible Installer currently holds a Certification in the same Technology as the Project
    return {
      isValid: false,
      validationError: SolutionGuaranteeValidationError.Certification
    };
  }

  const isTierAvailable = checkCompanyTier(
    guaranteeType.tiersAvailable,
    company.tier
  );
  if (!isTierAvailable) {
    //You are in a Tier that supports the Guarantee Type.
    return {
      isValid: false,
      validationError: SolutionGuaranteeValidationError.Tier
    };
  }

  const isBuilderOwnerCompleted = checkBuildingOwner(project);
  if (!isBuilderOwnerCompleted) {
    //The mandatory Building Owner fields are complete for the Project, i.e.
    return {
      isValid: false,
      validationError: SolutionGuaranteeValidationError.BuilderOwner
    };
  }

  const isProjectDetailsCompleted = checkProjectDetail(project);
  if (!isProjectDetailsCompleted) {
    //The other mandatory Project details are complete present:
    return {
      isValid: false,
      validationError: SolutionGuaranteeValidationError.ProjectDetail
    };
  }
  return {
    isValid: true
  };
};
export const isGuaranteeApplicationEnable = (
  project: GetProjectQuery["project"]
) => {
  if (!checkProjectDetail(project)) {
    return false;
  }

  if (!checkBuildingOwner(project)) {
    return false;
  }

  const { company, guarantees } = project;

  if (guarantees.nodes.length === 0) return true;

  const guarantee = guarantees.nodes[0];
  const { guaranteeType } = guarantee;

  if (!checkCompanyTier(guaranteeType.tiersAvailable, company.tier)) {
    return false;
  }

  return true;
};

const checkEvidence = (
  guaranteEvidenceItems: GetProjectQuery["project"]["evidenceItems"]["nodes"] = [],
  //TODO: Find an alternative way to define parameter type.
  evidenceCategories: GetProjectQuery["project"]["guarantees"]["nodes"][0]["guaranteeType"]["evidenceCategoriesCollection"]["items"]
) => {
  for (const { referenceCode, minimumUploads } of evidenceCategories) {
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
