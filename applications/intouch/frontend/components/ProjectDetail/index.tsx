import React, { useCallback } from "react";
import { gql } from "@apollo/client";
import Grid from "@bmi/grid";
import Tabs from "@bmi/tabs";
import Typography from "@bmi/typography";
import { Guarantee, Note, ProjectMember } from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import { ProjectsHeader } from "../../components/Cards/ProjectsHeader";
import { BuildingOwnerDetails } from "../../components/Cards/BuildingOwnerDetails";
import { ProjectsInsight } from "../../components/Cards/ProjectsInsight";
import { TabCard } from "../../components/Cards/TabCard";
import { TeamTab } from "../../components/Tabs/Team";
import { GuaranteeTab } from "../../components/Tabs/Guarantee";
import { UploadsTab } from "../../components/Tabs/Uploads";
import { NoProjectsCard } from "../../components/Cards/NoProjects";
import { NoteTab } from "../../components/Tabs/Notes";
import { useGetProjectQuery } from "../../graphql/generated/hooks";
import { GetProjectQuery } from "../../graphql/generated/operations";
import {
  getProjectStatus,
  getProjectGuaranteeStatus
} from "../../lib/utils/project";
import log from "../../lib/logger";

const ProjectDetail = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation("project-page");

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
              <GuaranteeTab project={project} />
            </TabCard>
          </Tabs.TabPanel>
          <Tabs.TabPanel heading="Uploads" index="three">
            <TabCard>
              <UploadedFiles project={project} />
            </TabCard>
          </Tabs.TabPanel>
          <Tabs.TabPanel heading="Notes" index="four">
            <TabCard>
              <NoteTab notes={project.notes?.nodes as Note[]} />
            </TabCard>
          </Tabs.TabPanel>
        </Tabs>
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

  const guaranteeEvidence = getGuaranteeEvidence(
    guarantees.nodes as Guarantee[]
  );

  return (
    <UploadsTab
      projectId={id}
      guaranteeId={guaranteeEvidence.guaranteeId}
      uploads={map}
      isContentfulEvidenceAvailable={guaranteeEvidence.customEvidenceAvailable}
    />
  );
};

const getGuaranteeEvidence = (guarantees: Guarantee[]) => {
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
          guaranteeTypeId
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
          customEvidenceCategoryId
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
