import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Grid from "@bmi/grid";
import Tabs from "@bmi/tabs";
import Typography from "@bmi/typography";

import { getAuth0Instance } from "../../lib/auth0";
import { ProjectsHeader } from "../../components/Cards/ProjectsHeader";
import { BuildingOwnerDetails } from "../../components/Cards/BuildingOwnerDetails";
import { ProjectsInsight } from "../../components/Cards/ProjectsInsight";
import { TabCard } from "../../components/Cards/TabCard";
import { TeamTab } from "../../components/Tabs/Team";
import { GuaranteeTab } from "../../components/Tabs/Guarantee";
import { UploadsTab } from "../../components/Tabs/Uploads";
import { NoProjectsCard } from "../../components/Cards/NoProjects";

const projectDetails = [
  { id: 1, name: "Old Brompton Library", company: "JS Roofers" },
  { id: 2, name: "Kensington School", company: "Mark's Roofing" },
  { id: 3, name: "Greenwich Observatory", company: "Horizon Roofing Co" },
  { id: 4, name: "Camden Crown Pub", company: "JS Roofers" },
  { id: 5, name: "Leyton Sports Hall", company: "JS Roofers" }
];

const ProjectDetail = ({ projectId }: { projectId: number }) => {
  const projectDetail = projectDetails.find(
    (detail) => detail.id === projectId
  );

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

  return (
    <>
      <Grid item xs={12} md={8}>
        <ProjectsHeader
          title={projectDetail.name}
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
              <UploadsTab />
            </TabCard>
          </Tabs.TabPanel>
        </Tabs>
      </Grid>
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const auth0 = await getAuth0Instance(ctx.req, ctx.res);
  return auth0.withPageAuthRequired({
    async getServerSideProps({ locale, ...ctx }) {
      return {
        props: {
          ...(await serverSideTranslations(locale, ["common"]))
        }
      };
    }
  })(ctx);
};

export default withPageAuthRequired(ProjectDetail);
