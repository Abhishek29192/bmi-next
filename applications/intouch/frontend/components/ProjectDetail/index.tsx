import { gql } from "@apollo/client";
import { Grid, Tabs, Typography } from "@bmi-digital/components";
import {
  GuaranteeEventType,
  Project,
  ProjectMember
} from "@bmi/intouch-api-types";
import { DeepPartial } from "applications/intouch/frontend/lib/utils/types";
import { useTranslation } from "next-i18next";
import React, { useCallback, useState } from "react";
import { useAccountContext } from "../../context/AccountContext";
import {
  GetProjectDocument,
  useCreateGuaranteePdfMutation,
  useGetProjectQuery,
  useUpdateGuaranteeMutation
} from "../../graphql/generated/hooks";
import { GetProjectQuery } from "../../graphql/generated/operations";
import log from "../../lib/logger";
import can from "../../lib/permissions/can";
import {
  getGuaranteeEventType,
  getGuaranteeStatus,
  getProjectCertifiedInstallers,
  getProjectDaysRemaining,
  getProjectGuaranteeStatus,
  getProjectStatus,
  isProjectApprovable,
  isSolutionOrSystemGuaranteeExist
} from "../../lib/utils/project";
import { BuildingOwnerDetails } from "../Cards/BuildingOwnerDetails";
import { NoProjectsCard } from "../Cards/NoProjects";
import { ProjectActionsCard } from "../Cards/ProjectActionsCard";
import { ProjectsHeader } from "../Cards/ProjectsHeader";
import { ProjectsInsight } from "../Cards/ProjectsInsight";
import { TabCard } from "../Cards/TabCard";
import BuildingOwnerDetailsEditButton from "../Pages/Project/BuildingOwnerDetailsEditAction/Button";
import ProjectEditAction from "../Pages/Project/ProjectEditAction/Button";
import { GuaranteeTab } from "../Tabs/Guarantee";
import { NoteTab } from "../Tabs/Notes";
import { TeamTab } from "../Tabs/Team";
import { UploadsTab } from "../Tabs/Uploads";

type ProjectDetailProps = {
  projectId: number;
  onUpdateGuarantee: () => void;
};

const ProjectDetail = ({
  projectId,
  onUpdateGuarantee
}: ProjectDetailProps) => {
  const { t } = useTranslation("project-page");
  const { account } = useAccountContext();
  const [isPolling, setIsPolling] = useState(false);
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
      if (guarantee.status === "APPROVED") {
        createGuaranteePdfMutation({
          variables: {
            id: guarantee.id
          }
        });
      }

      onUpdateGuarantee && onUpdateGuarantee();
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
  const [createGuaranteePdfMutation] = useCreateGuaranteePdfMutation();

  // NOTE: if it has multiple guarantees they must ALL be PRODUCT, so ok look at first one.
  const getProjectGuaranteeType = useCallback(
    (project: GetProjectQuery["project"]) => {
      const coverage = project.guarantees.nodes[0]?.coverage;
      return coverage
        ? t(`guarantee.type.${coverage}`)
        : t("guarantee.notRequested");
    },
    [t]
  );

  const guaranteeUpdateHandler = (guaranteeEventType: GuaranteeEventType) => {
    const id = project.guarantees.nodes[0].id;
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
      <Grid nonce={undefined} item xs={12}>
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

  const startPollingPdf = (interval = 5000) => {
    if (!isPolling && startPolling) {
      startPolling(interval);
      setIsPolling(true);
    }
  };

  const stopPollingPdf = () => {
    if (isPolling && stopPolling) {
      stopPolling();
      setIsPolling(false);
    }
  };

  const {
    data: { project } = {},
    loading,
    error,
    startPolling,
    stopPolling
  } = useGetProjectQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ project }) => {
      const isMissingPdf = project.guarantees.nodes.some(
        (guarantee) =>
          !guarantee.signedFileStorageUrl &&
          !["FLAT_SOLUTION", "PITCHED_SOLUTION"].includes(
            guarantee.guaranteeReferenceCode
          )
      );

      // If some guarantees are missing the pdf means it is still in creation, I need a polling
      if (isMissingPdf) {
        startPollingPdf();
      }
      // If not necessary stop any polling if already in started
      else {
        stopPollingPdf();
      }
    },
    variables: {
      projectId: projectId
    }
  });

  if (error) {
    log({
      severity: "ERROR",
      message: `Error loading project details. ID: ${projectId}. Error: ${error.toString()}`
    });
    return (
      <div data-testid="project-error" style={{ minHeight: "100vh" }}>
        {t("projectDetails.error")}
      </div>
    );
  }

  if (loading && !project)
    return (
      <div style={{ minHeight: "100vh" }}>{t("projectDetails.loading")}</div>
    );

  const isGuaranteeAppliable =
    can(account, "project", "submitSolutionGuarantee", {
      isArchived: project.hidden
    }) && !isSolutionOrSystemGuaranteeExist(project);

  const canNominateResponsibleInstaller = (): boolean => {
    return (
      can(account, "project", "nominateResponsible", {
        isArchived: project.hidden
      }) && ["NEW", "REJECTED"].includes(getGuaranteeStatus(project))
    );
  };

  return (
    <>
      <Grid nonce={undefined} item xs={12} md={8}>
        <ProjectsHeader
          title={project.name}
          technology={project.technology}
          projectCode={`${project.id}`}
          projectStatus={t(
            getProjectStatus(project.startDate, project.endDate)
          )}
          buildingAddress={project.siteAddress}
          projectDescription={project.description}
          roofArea={project.roofArea}
          startDate={project.startDate}
          endDate={project.endDate}
          guaranteeType={getProjectGuaranteeType(project)}
          guaranteeStatus={getProjectGuaranteeStatus(project as Project)}
          guaranteeEventType={getGuaranteeEventType(
            project as DeepPartial<Project>,
            account.id
          )}
          guaranteeEventHandler={guaranteeUpdateHandler}
          renderActions={() => <ProjectEditAction project={project} />}
          hidden={project.hidden}
        />

        <BuildingOwnerDetails
          name={[project.buildingOwnerFirstname, project.buildingOwnerLastname]
            .filter(Boolean)
            .join(" ")}
          email={project.buildingOwnerMail}
          company={project.buildingOwnerCompany}
          address={project.buildingOwnerAddress}
          renderActions={() => (
            <BuildingOwnerDetailsEditButton project={project} />
          )}
        />
      </Grid>

      <Grid nonce={undefined} item xs={12} md={4}>
        <ProjectsInsight
          daysRemaining={getProjectDaysRemaining(
            project.startDate,
            project.endDate
          )}
          certifiedInstallers={getProjectCertifiedInstallers(project)}
        />
      </Grid>
      <Grid nonce={undefined} item xs={12}>
        <Tabs initialValue="one">
          <Tabs.TabPanel heading={t("tabs.team")} index="one">
            <TabCard>
              <TeamTab
                projectId={projectId}
                teams={project.projectMembers.nodes as ProjectMember[]}
                canNominateProjectResponsible={canNominateResponsibleInstaller()}
                project={project}
              />
            </TabCard>
          </Tabs.TabPanel>
          <Tabs.TabPanel heading={t("tabs.guarantee")} index="two">
            <TabCard>
              <GuaranteeTab
                project={project}
                onGuaranteeSubmitted={startPollingPdf}
                isApplyGuarantee={isGuaranteeAppliable}
              />
            </TabCard>
          </Tabs.TabPanel>
          <Tabs.TabPanel heading={t("tabs.uploads")} index="three">
            <TabCard>
              <UploadsTab project={project} />
            </TabCard>
          </Tabs.TabPanel>
          <Tabs.TabPanel heading={t("tabs.notes")} index="four">
            <TabCard>
              <NoteTab
                project={project}
                accountId={account.id}
                notes={project.notes.nodes}
              />
            </TabCard>
          </Tabs.TabPanel>
        </Tabs>
      </Grid>
      <Grid nonce={undefined} item xs={12}>
        {can(account, "project", "adminActions", {
          isArchived: project.hidden
        }) ? (
          <ProjectActionsCard
            projectId={project.id}
            isArchived={project.hidden}
            isSolutionOrSystemGuaranteeExist={isSolutionOrSystemGuaranteeExist(
              project
            )}
            guaranteeEventHandler={
              isProjectApprovable(
                project as DeepPartial<Project>,
                account.id
              ) && guaranteeUpdateHandler
            }
            project={project}
          />
        ) : null}
      </Grid>
    </>
  );
};

export default React.memo(ProjectDetail, (prev, next) => {
  if (prev.projectId !== next.projectId) {
    return false;
  }
  return true;
});

export const GET_PROJECT = gql`
  fragment ProjectDetailsFragment on Project {
    id
    hidden
    name
    technology
    roofArea
    startDate
    endDate
    description
    siteAddress {
      ...AddressLinesFragment
    }
    buildingOwnerFirstname
    buildingOwnerLastname
    buildingOwnerCompany
    buildingOwnerMail
    buildingOwnerAddress {
      ...AddressLinesFragment
    }
    inspection
    inspectedAt
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
              description {
                json
              }
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
        fileStorageId
        signedFileStorageUrl
        status
      }
    }
    evidenceItems {
      nodes {
        id
        name
        signedUrl
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
        senderName
        createdAt
      }
    }
    projectMembers {
      nodes {
        ...ProjectMemberDetailsFragment
      }
    }
    company {
      id
      name
      tier
    }
  }

  query GetProject($projectId: Int!) {
    project(id: $projectId) {
      ...ProjectDetailsFragment
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
