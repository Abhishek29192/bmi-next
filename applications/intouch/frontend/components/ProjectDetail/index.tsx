import React from "react";
import { gql } from "@apollo/client";
import Grid from "@bmi/grid";
import Tabs from "@bmi/tabs";
import Typography from "@bmi/typography";
import { Note, ProjectMember } from "@bmi/intouch-api-types";
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

const ProjectDetail = ({ projectId }: { projectId: number }) => {
  if (!projectId) {
    return (
      <Grid item xs={12}>
        <NoProjectsCard title="No projects to display">
          <Typography variant="subtitle2">
            You have not select any project yet!
          </Typography>
          <Typography variant="subtitle2">
            Select the &quot;project&quot; from sidebar to get started.
          </Typography>
        </NoProjectsCard>
      </Grid>
    );
  }

  const { data: { project = null } = {}, loading } = useGetProjectQuery({
    variables: {
      projectId: projectId
    }
  });

  if (loading) return <></>;

  const getProjectStatus = (startDate, endDate) => {
    if (!startDate && !endDate) return "Not started";
    else if (startDate && !endDate) return "In progress";
    else return "Completed";
  };

  return (
    <>
      <Grid item xs={12} md={8}>
        <ProjectsHeader
          title={project.name}
          projectCode={`${project.id}`}
          projectStatus={getProjectStatus(project.startDate, project.endDate)}
          buildingAddress={`${project.siteAddress.firstLine}, ${project.siteAddress.secondLine}, ${project.siteAddress.region}, ${project.siteAddress.town}, ${project.siteAddress.postcode}`}
          projectDescription={project.description}
          startDate={project.startDate}
          endDate={project.endDate}
          guarantee="-"
          guaranteeStatus="-"
        />

        <BuildingOwnerDetails
          name={`${project.buildingOwnerFirstname} ${project.buildingOwnerLastname}`}
          email={project.buildingOwnerMail}
          company={project.buildingOwnerCompany}
          address={`${project.buildingOwnerAddress?.firstLine}, ${project.buildingOwnerAddress?.secondLine}, ${project.buildingOwnerAddress?.region}, ${project.buildingOwnerAddress?.town}, ${project.buildingOwnerAddress?.postcode}`}
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
              <GuaranteeTab />
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
  const { guarantees, evidenceItems } = project;

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
  return <UploadsTab uploads={map} />;
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
            name
            evidenceCategoriesCollection {
              items {
                name
                minimumUploads
              }
            }
          }
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
        }
      }
    }
  }
`;
