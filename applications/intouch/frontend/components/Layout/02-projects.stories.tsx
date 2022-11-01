import { Button, Grid, Tabs, Typography } from "@bmi-digital/components";
import React from "react";
import GridStyles from "../../styles/Grid.module.scss";
import { BuildingOwnerDetails } from "../Cards/BuildingOwnerDetails";
import { NoProjectsCard } from "../Cards/NoProjects";
import { ProjectsHeader } from "../Cards/ProjectsHeader";
import { ProjectsInsight } from "../Cards/ProjectsInsight";
import { TabCard } from "../Cards/TabCard";
import { Projects } from "../SidePanel/index.stories";
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
      nonce={undefined}
      container
      spacing={3}
      className={GridStyles.outerGrid}
      alignItems="stretch"
      style={{ height: "calc(100% + 24px)" }}
    >
      <Grid nonce={undefined} item xs={12}>
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
        nonce={undefined}
        container
        spacing={3}
        className={GridStyles.outerGrid}
        alignItems="stretch"
      >
        <Grid nonce={undefined} item xs={12} md={8}>
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

        <Grid nonce={undefined} item xs={12} md={4}>
          <ProjectsInsight daysRemaining={180} certifiedInstallers={0} />
        </Grid>
        <Grid nonce={undefined} item xs={12}>
          <Tabs initialValue="one">
            <Tabs.TabPanel heading="Team" index="one">
              <TabCard></TabCard>
            </Tabs.TabPanel>
            <Tabs.TabPanel heading="Guarantee" index="two">
              <TabCard>
                <GuaranteeTab
                  onGuaranteeSubmitted={() => {
                    // no-op
                  }}
                  project={null}
                  isApplyGuarantee={false}
                />
              </TabCard>
            </Tabs.TabPanel>
            <Tabs.TabPanel heading="Uploads" index="three">
              <TabCard>
                <UploadsTab project={null} />
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
