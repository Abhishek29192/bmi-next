import React, { useCallback, useState } from "react";
import { gql } from "@apollo/client";
import { Grid } from "@bmi/components";
import { Tabs } from "@bmi/components";
import { Typography } from "@bmi/components";
import { GuaranteeEventType, ProjectMember } from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import can from "../../lib/permissions/can";
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
import ProjectEditAction from "../Pages/Project/ProjectEditAction/Button";
import BuildingOwnerDetailsEditButton from "../Pages/Project/BuildingOwnerDetailsEditAction/Button";
import {
  GetProjectDocument,
  useCreateGuaranteePdfMutation,
  useGetProjectQuery,
  useUpdateGuaranteeMutation
} from "../../graphql/generated/hooks";
import { GetProjectQuery } from "../../graphql/generated/operations";
import {
  getProjectStatus,
  getProjectGuaranteeStatus,
  getGuaranteeEventType,
  isProjectApprovable,
  isSolutionOrSystemGuaranteeExist,
  getGuaranteeStatus,
  getProjectDaysRemaining,
  getProjectCertifiedInstallers
} from "../../lib/utils/project";
import log from "../../lib/logger";
import { useAccountContext } from "../../context/AccountContext";

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

  // NOTE: if has multiple guarantees they must ALL be PRODUCT, so ok look at first one
  const getProjectGuaranteeType = useCallback(
    (project: GetProjectQuery["project"]) => {
      const coverage = project?.guarantees?.nodes?.[0]?.coverage;
      return coverage
        ? t(`guarantee.type.${coverage}`)
        : t("guarantee.notRequested");
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
    error,
    startPolling,
    stopPolling
  } = useGetProjectQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ project }) => {
      const isMissingPdf = project?.guarantees?.nodes?.some(
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
      <div style={{ minHeight: "100vh" }}>{t("projectDetails.error")}</div>
    );
  }

  if (loading && !project)
    return (
      <div style={{ minHeight: "100vh" }}>{t("projectDetails.loading")}</div>
    );

  const isGuaranteeAppliable =
    can(account, "project", "submitSolutionGuarantee") &&
    !isSolutionOrSystemGuaranteeExist(project);

  const canNominateResponsibleInstaller = (): boolean => {
    return (
      can(account, "project", "nominateResponsible") &&
      ["NEW", "REJECTED"].includes(getGuaranteeStatus(project))
    );
  };

  const startPollingPdf = (interval = 5000) => {
    if (!isPolling) {
      startPolling(interval);
      setIsPolling(true);
    }
  };

  const stopPollingPdf = () => {
    if (isPolling) {
      stopPolling();
      setIsPolling(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={8}>
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
          guaranteeStatus={getProjectGuaranteeStatus(project)}
          guaranteeEventType={getGuaranteeEventType(project, account.id)}
          guaranteeEventHandler={guaranteeUpdateHandler}
          renderActions={() => <ProjectEditAction project={project} />}
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

      <Grid item xs={12} md={4}>
        <ProjectsInsight
          daysRemaining={getProjectDaysRemaining(
            project.startDate,
            project.endDate
          )}
          certifiedInstallers={getProjectCertifiedInstallers(project)}
        />
      </Grid>
      <Grid item xs={12}>
        <Tabs initialValue="one">
          <Tabs.TabPanel heading={t("tabs.team")} index="one">
            <TabCard>
              <TeamTab
                projectId={projectId}
                teams={project.projectMembers?.nodes as ProjectMember[]}
                canNominateProjectResponsible={canNominateResponsibleInstaller()}
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
