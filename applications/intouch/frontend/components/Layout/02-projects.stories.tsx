import React from "react";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import Tabs from "@bmi/tabs";
import GridStyles from "../../styles/Grid.module.scss";
import { Projects } from "../SidePanel/index.stories";
import { NoProjectsCard } from "../Cards/NoProjects";
import { BuildingOwnerDetails } from "../Cards/BuildingOwnerDetails";
import { ProjectsHeader } from "../Cards/ProjectsHeader";
import { ProjectsInsight } from "../Cards/ProjectsInsight";
import { TabCard } from "../Cards/TabCard";
import { TeamTab } from "../Tabs/Team";
import { GuaranteeTab } from "../Tabs/Guarantee";
import { UploadsTab } from "../Tabs/Uploads";
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
            projectCode="PROFLO-d1847"
            projectStatus="In progress"
            buildingAddress="8 Old Brompton Road, South Kensington, London, SW7 3SS"
            projectDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum
            dolor sit amet..."
            startDate="24 Feb 2021"
            endDate="30 March 2022"
            guarantee="Not requested"
            guaranteeStatus="N/A"
          />

          <BuildingOwnerDetails
            name="Lewis Hamilton"
            email="l.hamilton@f1mercedes.com"
            company="JP Morgan"
            address="2 Flanton Road, Bow, London, E1 4FG"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <ProjectsInsight
            daysRemaining="180"
            totalDays="185"
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
                <UploadsTab uploads={uploadedFiles} />
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

const uploadedFiles = new Map<string, string[]>([
  [
    "Ventilation systems",
    [
      `Ut enim ad minim veniam, quis nostrud exercitation ullamco
  laboris nisi ut aliquip ex ea commodo consequat.`
    ]
  ],
  [
    "Roof corners",
    [
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
      eget.`
    ]
  ],
  [
    "Chimney",
    [
      `Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.`
    ]
  ],
  [
    "Receipt of purchase",
    [
      `Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.`
    ]
  ],
  [
    "Supporting files",
    [
      `Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.`
    ]
  ]
]);
