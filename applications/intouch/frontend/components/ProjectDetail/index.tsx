import React, { useCallback } from "react";
import { gql } from "@apollo/client";
import Grid from "@bmi/grid";
import Tabs from "@bmi/tabs";
import Typography from "@bmi/typography";
import { GuaranteeEventType, ProjectMember } from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import can from "lib/permissions/can";
import { ProjectsHeader } from "../Cards/ProjectsHeader";
import { BuildingOwnerDetails } from "../Cards/BuildingOwnerDetails";
import { ProjectsInsight } from "../Cards/ProjectsInsight";
import { TabCard } from "../Cards/TabCard";
import { TeamTab } from "../Tabs/Team";
import { GuaranteeTab } from "../Tabs/Guarantee";
import { UploadsTab } from "../Tabs/Uploads";
import { NoProjectsCard } from "../Cards/NoProjects";
import { NoteTab } from "../Tabs/Notes";
import { ProjectActionsCard } from "../Cards/ProjectActionsCard";
import {
  GetProjectDocument,
  useGetProjectQuery,
  useUpdateGuaranteeMutation
} from "../../graphql/generated/hooks";
import { GetProjectQuery } from "../../graphql/generated/operations";
import {
  getProjectStatus,
  getProjectGuaranteeStatus,
  getGuaranteeEventType,
  isProjectApprovable,
  isSolutionOrSystemGuaranteeExist
} from "../../lib/utils/project";
import log from "../../lib/logger";
import { useAccountContext } from "../../context/AccountContext";

const ProjectDetail = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation("project-page");
  const { account } = useAccountContext();
  const [updateGuarantee] = useUpdateGuaranteeMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error updating guarantee status: ${error.toString()}`
      });
    },
    onCompleted: ({ updateGuarantee: { guarantee } }) => {
      log({
        severity: "INFO",
        message: `Guarantee ID [${guarantee.id}] status updated`
      });
    },
    refetchQueries: [
      {
        query: GetProjectDocument,
        variables: {
          projectId: projectId
        }
      }
    ]
  });

  // NOTE: if has multiple guarantees they must ALL be PRODUCT, so ok look at first one
  const getProjectGuaranteeType = useCallback(
    (project: GetProjectQuery["project"]) => {
      return (
        project?.guarantees?.nodes?.[0]?.guaranteeType?.displayName ||
        t("guarantee.notRequested")
      );
    },
    [t]
  );

  const guaranteeUpdateHandler = (guaranteeEventType: GuaranteeEventType) => {
    const id = project?.guarantees?.nodes?.[0]?.id;
    updateGuarantee({
      variables: {
        input: {
          id,
          guaranteeEventType,
          patch: {}
        }
      }
    });
  };

  if (!projectId) {
    return (
      <Grid item xs={12}>
        <NoProjectsCard title={t("noProjecSelected.title")}>
          <Typography variant="subtitle2">
            {t("noProjecSelected.body1")}
          </Typography>
          <Typography variant="subtitle2">
            {t("noProjecSelected.body2")}
          </Typography>
        </NoProjectsCard>
      </Grid>
    );
  }

  const {
    data: { project } = {},
    loading,
    error
  } = useGetProjectQuery({
    variables: {
      projectId: projectId
    }
  });

  if (error) {
    log({
      severity: "ERROR",
      message: `Error loading project details. ID: ${projectId}. Error: ${error.toString()}`
    });
    return <div>Error loading project details.</div>;
  }

  // TODO: Microcopy
  if (loading) return <>Loading project details...</>;

  const isGuaranteeAppliable =
    can(account, "project", "submitSolutionGuarantee") &&
    !isSolutionOrSystemGuaranteeExist(project);

  return (
    <>
      <Grid item xs={12} md={8}>
        <ProjectsHeader
          title={project.name}
          projectCode={`${project.id}`}
          projectStatus={getProjectStatus(project.startDate, project.endDate)}
          buildingAddress={project.siteAddress}
          projectDescription={project.description}
          roofArea={project.roofArea}
          startDate={project.startDate}
          endDate={project.endDate}
          guaranteeType={getProjectGuaranteeType(project)}
          guaranteeStatus={getProjectGuaranteeStatus(project)}
          guaranteeEventType={getGuaranteeEventType(project, account.id)}
          guaranteeEventHandler={guaranteeUpdateHandler}
        />

        <BuildingOwnerDetails
          name={[project.buildingOwnerFirstname, project.buildingOwnerLastname]
            .filter(Boolean)
            .join(" ")}
          email={project.buildingOwnerMail}
          company={project.buildingOwnerCompany}
          address={project.buildingOwnerAddress}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <ProjectsInsight
          daysRemaining="1"
          totalDays="5"
          certifiedInstallers="0"
        />
      </Grid>
      <Grid item xs={12}>
        <Tabs initialValue="one">
          <Tabs.TabPanel heading="Team" index="one">
            <TabCard>
              <TeamTab
                projectId={projectId}
                teams={project.projectMembers?.nodes as ProjectMember[]}
              />
            </TabCard>
          </Tabs.TabPanel>
          <Tabs.TabPanel heading="Guarantee" index="two">
            <TabCard>
              <GuaranteeTab
                project={project}
                isApplyGuarantee={isGuaranteeAppliable}
              />
            </TabCard>
          </Tabs.TabPanel>
          <Tabs.TabPanel heading="Uploads" index="three">
            <TabCard>
              <UploadedFiles project={project} />
            </TabCard>
          </Tabs.TabPanel>
          <Tabs.TabPanel heading="Notes" index="four">
            <TabCard>
              <NoteTab
                accountId={account.id}
                projectId={project.id}
                notes={project.notes?.nodes}
              />
            </TabCard>
          </Tabs.TabPanel>
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        {can(account, "project", "adminActions") ? (
          <ProjectActionsCard
            projectId={project.id}
            isArchived={project.hidden}
            guaranteeEventHandler={
              isProjectApprovable(project, account.id) && guaranteeUpdateHandler
            }
          />
        ) : null}
      </Grid>
    </>
  );
};

const UploadedFiles = ({
  project
}: {
  project: GetProjectQuery["project"];
}) => {
  const { t } = useTranslation("project-page");
  const { id, guarantees, evidenceItems } = project;

  const map = new Map<string, string[]>();
  //Default category
  map.set(t("MISCELLANEOUS"), []);
  //Default guarantee types
  for (const guarantee of guarantees.nodes) {
    const evidenceCategories =
      guarantee.guaranteeType?.evidenceCategoriesCollection?.items;
    for (const evidenceCategory of evidenceCategories) {
      map.set(evidenceCategory.name, []);
    }
  }

  for (const evidence of evidenceItems.nodes) {
    const categoryLabel =
      evidence.evidenceCategoryType !== "CUSTOM"
        ? t(evidence.evidenceCategoryType)
        : evidence.customEvidenceCategory?.name ||
          t(evidence.evidenceCategoryType);

    const existFiles = map.has(categoryLabel) ? map.get(categoryLabel) : [];
    map.set(categoryLabel, [...existFiles, evidence.name]);
  }

  const guaranteeEvidence = getGuaranteeEvidence(guarantees.nodes);

  return (
    <UploadsTab
      projectId={id}
      guaranteeId={guaranteeEvidence.guaranteeId}
      uploads={map}
      isContentfulEvidenceAvailable={guaranteeEvidence.customEvidenceAvailable}
    />
  );
};

const getGuaranteeEvidence = (
  guarantees: GetProjectQuery["project"]["guarantees"]["nodes"]
) => {
  const solutionGuarantee =
    guarantees.find((node) => node.guaranteeType.coverage === "SOLUTION") ||
    null;

  let evidenceAvailable = false;
  if (solutionGuarantee !== null) {
    evidenceAvailable = !["APPROVED", "REVIEW"].includes(
      solutionGuarantee.status
    );
  }
  return {
    guaranteeId: solutionGuarantee?.id,
    customEvidenceAvailable: evidenceAvailable
  };
};

export default ProjectDetail;

export const GET_PROJECT = gql`
  query GetProject($projectId: Int!) {
    project(id: $projectId) {
      id
      hidden
      name
      technology
      roofArea
      startDate
      endDate
      description
      siteAddress {
        firstLine
        secondLine
        town
        region
        postcode
      }
      buildingOwnerFirstname
      buildingOwnerLastname
      buildingOwnerCompany
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
          reviewerAccountId
          coverage
          languageCode
          guaranteeType {
            sys {
              id
            }
            name
            coverage
            displayName
            technology
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
          productByProductBmiRef {
            ...ProjectDetailsProductFragment
          }
          systemBySystemBmiRef {
            id
            name
            description
            systemMembersBySystemBmiRef {
              nodes {
                id
                productByProductBmiRef {
                  ...ProjectDetailsProductFragment
                }
              }
            }
          }
          status
        }
      }
      evidenceItems {
        nodes {
          id
          name
          guaranteeId
          evidenceCategoryType
          customEvidenceCategoryKey
          customEvidenceCategory {
            name
            minimumUploads
          }
        }
      }
      notes(orderBy: ID_DESC) {
        nodes {
          id
          body
          authorId
          author {
            firstName
            lastName
          }
          createdAt
        }
      }
      projectMembers {
        nodes {
          id
          accountId
          account {
            firstName
            lastName
            role
            certificationsByDoceboUserId {
              nodes {
                name
                technology
              }
            }
          }
          isResponsibleInstaller
        }
      }
      company {
        id
        name
        tier
      }
    }
  }
`;

export const PROJECT_DETAIL_PRODUCT_FRAGMENT = gql`
  fragment ProjectDetailsProductFragment on Product {
    id
    name
    brand
    family
    description
  }
`;
