import React from "react";
import { gql } from "@apollo/client";
import Grid from "@bmi/grid";
import Tabs from "@bmi/tabs";
import Typography from "@bmi/typography";
import { ProjectsHeader } from "../Cards/ProjectsHeader";
import { BuildingOwnerDetails } from "../Cards/BuildingOwnerDetails";
import { ProjectsInsight } from "../Cards/ProjectsInsight";
import { TabCard } from "../Cards/TabCard";
import { TeamTab } from "../Tabs/Team";
import { GuaranteeTab } from "../Tabs/Guarantee";
import { UploadsTab } from "../Tabs/Uploads";
import { NoProjectsCard } from "../Cards/NoProjects";
import { useGetProjectQuery } from "../../graphql/generated/hooks";

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
              <TeamTab />
            </TabCard>
          </Tabs.TabPanel>
          <Tabs.TabPanel heading="Guarantee" index="two">
            <TabCard>
              <GuaranteeTab />
            </TabCard>
          </Tabs.TabPanel>
          <Tabs.TabPanel heading="Uploads" index="three">
            <TabCard>
              <UploadsTab />
            </TabCard>
          </Tabs.TabPanel>
        </Tabs>
      </Grid>
    </>
  );
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
    }
  }
`;
