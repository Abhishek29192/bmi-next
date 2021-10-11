import React from "react";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import Tabs from "@bmi/tabs";
import { ProjectMember } from "@bmi/intouch-api-types";
import GridStyles from "../../styles/Grid.module.scss";
import { Projects } from "../SidePanel/index.stories";
import { NoProjectsCard } from "../Cards/NoProjects";
import { BuildingOwnerDetails } from "../Cards/BuildingOwnerDetails";
import { ProjectsHeader } from "../Cards/ProjectsHeader";
import { ProjectsInsight } from "../Cards/ProjectsInsight";
import { TabCard } from "../Cards/TabCard";
import { GuaranteeTab } from "../Tabs/Guarantee";
import { UploadsTab, Evidence } from "../Tabs/Uploads";
import { Layout, LayoutProps } from ".";

export default {
  title: "Pages/Projects",
  component: Layout,
  argTypes: {
    title: { control: "text" }
  }
};

export const NoProjects = ({ title }: LayoutProps) => (
  <Layout title={title}>
    <Grid
      container
      spacing={3}
      className={GridStyles.outerGrid}
      alignItems="stretch"
      style={{ height: "calc(100% + 24px)" }}
    >
      <Grid item xs={12}>
        <NoProjectsCard title="No projects to display">
          <Typography variant="subtitle2">
            You have not added any new projects yet!
          </Typography>
          <Typography variant="subtitle2">
            Select the &quot;Add new project&quot; button below to get started.
          </Typography>
          <Button size="large" style={{ marginTop: "2rem" }}>
            Add new project
          </Button>
        </NoProjectsCard>
      </Grid>
    </Grid>
  </Layout>
);

NoProjects.args = {
  title: "Projects"
};

export const Team = ({ title }: LayoutProps) => (
  <Layout title={title}>
    <div style={{ display: "flex" }}>
      <Projects />
      <Grid
        container
        spacing={3}
        className={GridStyles.outerGrid}
        alignItems="stretch"
      >
        <Grid item xs={12} md={8}>
          <ProjectsHeader
            title="Old Brompton Library"
            technology="FLAT"
            projectCode="PROFLO-d1847"
            projectStatus="In progress"
            roofArea={100}
            buildingAddress={{
              firstLine: "8 Old Brompton Road",
              secondLine: "South Kensington",
              town: "London",
              postcode: "SW7 3SS"
            }}
            projectDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum
            dolor sit amet..."
            startDate="24 Feb 2021"
            endDate="30 March 2022"
            guaranteeType="Not requested"
            guaranteeStatus={"NOT_APPLICABLE"}
          />

          <BuildingOwnerDetails
            name="Lewis Hamilton"
            email="l.hamilton@f1mercedes.com"
            company="JP Morgan"
            address={{
              firstLine: "2 Flanton Road",
              town: "Bow",
              region: "London",
              postcode: "E1 4FG"
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <ProjectsInsight daysRemaining={180} certifiedInstallers={0} />
        </Grid>
        <Grid item xs={12}>
          <Tabs initialValue="one">
            <Tabs.TabPanel heading="Team" index="one">
              <TabCard></TabCard>
            </Tabs.TabPanel>
            <Tabs.TabPanel heading="Guarantee" index="two">
              <TabCard>
                <GuaranteeTab project={null} isApplyGuarantee={false} />
              </TabCard>
            </Tabs.TabPanel>
            <Tabs.TabPanel heading="Uploads" index="three">
              <TabCard>
                <UploadsTab projectId={1} uploads={uploadedFiles} />
              </TabCard>
            </Tabs.TabPanel>
          </Tabs>
        </Grid>
      </Grid>
    </div>
  </Layout>
);

Team.args = {
  title: "Projects"
};

const uploadedFiles = new Map<string, Evidence[]>([
  [
    "Ventilation systems",
    [
      {
        id: 1,
        name: `Ut enim ad minim veniam, quis nostrud exercitation ullamco
  laboris nisi ut aliquip ex ea commodo consequat.`
      }
    ]
  ],
  [
    "Roof corners",
    [
      {
        id: 2,
        name: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
      eget.`
      }
    ]
  ],
  [
    "Chimney",
    [
      {
        id: 3,
        name: `Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.`
      }
    ]
  ],
  [
    "Receipt of purchase",
    [
      {
        id: 4,
        name: `Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.`
      }
    ]
  ],
  [
    "Supporting files",
    [
      {
        id: 5,
        name: `Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.`
      }
    ]
  ]
]);

const teamMembers = [
  {
    nodeId: "1",
    id: 1,
    createdAt: "01/01/01",
    updatedAt: "01/01/01",
    account: {
      nodeId: "1",
      id: 1,
      firstName: "Lucy",
      lastName: "Walsh",
      role: "INSTALLER",
      certificationsByDoceboUserId: {
        nodes: [
          {
            nodeId: "1",
            id: 1,
            technology: "PITCHED",
            createdAt: "01/01/01",
            updatedAt: "01/01/01"
          }
        ]
      }
    }
  }
] as ProjectMember[];
