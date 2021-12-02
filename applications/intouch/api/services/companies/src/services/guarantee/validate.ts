import {
  Technology,
  ContentfulTiers,
  Tier,
  Project,
  ProjectMember,
  EvidenceItem,
  ContentfulEvidenceCategory
} from "@bmi/intouch-api-types";
import { GraphQLError } from "graphql";

enum SolutionGuaranteeValidationError {
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

type FetchResult<T> = {
  data?: T;
  errors?: GraphQLError[];
};
type ProjectDetails = {
  project: Project;
};

export const solutionGuaranteeSubmitValidate = async (
  client,
  projectId: number
) => {
  const { data, errors }: FetchResult<ProjectDetails> = await client(
    projectQuery,
    { projectId }
  );

  if (errors && errors.length > 0) {
    throw errors[0];
  }

  const validate = solutionGuaranteeGuaranteeValidate(data.project);
  return validate.isValid;
};

export const solutionGuaranteeGuaranteeValidate = (
  project: Project
): SolutionGuaranteeValidateResult => {
  const guarantee = project?.guarantees?.nodes?.[0];
  if (!guarantee) {
    return {
      isValid: false,
      validationError: SolutionGuaranteeValidationError.NoGuarantee
    };
  }
  if (!["NEW", "REJECTED", "APPROVED"].includes(guarantee.status)) {
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

const checkEvidence = (
  guaranteEvidenceItems: EvidenceItem[] = [],
  evidenceCategories: ContentfulEvidenceCategory[]
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

const getResponsibleInsalller = (projectMembers: ProjectMember[]) => {
  return projectMembers.find((member) => member.isResponsibleInstaller);
};

const checkCertification = (
  projectMember: ProjectMember,
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
}: Project) => {
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
}: Project) => {
  return [name, siteAddress, technology, roofArea, startDate, endDate].every(
    Boolean
  );
};

const projectQuery = `
query GetProject($projectId: Int!) {
  project(id: $projectId) {
    id
    name
    technology
    roofArea
    startDate
    endDate
    siteAddress {
      firstLine
      secondLine
      town
      region
      postcode
    }
    buildingOwnerFirstname
    buildingOwnerLastname
    buildingOwnerMail
    buildingOwnerAddress {
      firstLine
      secondLine
      town
      region
      postcode
    }
    guarantees {
      nodes {
        id
        guaranteeReferenceCode
        guaranteeType {
          tiersAvailable
          evidenceCategoriesCollection {
            items {
              sys {
                id
              }
              referenceCode
              name
              minimumUploads
            }
          }
        }
        status
      }
    }
    evidenceItems {
      nodes {
        evidenceCategoryType
        customEvidenceCategoryKey
      }
    }
    projectMembers {
      nodes {
        id
        accountId
        account {
          role
          certificationsByDoceboUserId {
            nodes {
              technology
            }
          }
        }
        isResponsibleInstaller
      }
    }
    company {
      id
      tier
    }
  }
}
`;
