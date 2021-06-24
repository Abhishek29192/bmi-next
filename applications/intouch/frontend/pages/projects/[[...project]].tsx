import React, { useState, useEffect } from "react";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { gql } from "@apollo/client";
import { withPage } from "../../lib/middleware/withPage";
import GridStyles from "../../styles/Grid.module.scss";
import { ProjectSidePanel } from "../../components/SidePanel/ProjectSidePanel";
import { Layout } from "../../components/Layout";
import { NoProjectsCard } from "../../components/Cards/NoProjects";
import { GetProjectsQuery } from "../../graphql/generated/operations";
import { getServerPageGetProjects } from "../../graphql/generated/page";

import ProjectDetail from "./project-detail";

export type PageProps = {
  projects: GetProjectsQuery["projects"];
};

const Projects = ({ projects }: PageProps) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [activeProjectId, setActiveProjectId] = useState<number>(null);

  useEffect(() => {
    const currentProjectId: number =
      parseInt((router.query.project || [])[0]) || projects?.nodes[0]?.id;

    setActiveProjectId(currentProjectId);
  }, [router]);

  const sidePanelHandler = (projectId: number) => {
    //setActiveProjectId(projectId);
    router.push(`/projects/${projectId}`, undefined, { shallow: true });
  };

  return (
    <Layout title={t("Projects")}>
      <div style={{ display: "flex" }}>
        <ProjectSidePanel
          projects={projects}
          onProjectSelected={sidePanelHandler}
        />

        <Grid
          container
          spacing={3}
          className={GridStyles.outerGrid}
          alignItems="stretch"
        >
          {projects?.nodes?.length > 0 && (
            <ProjectDetail projectId={activeProjectId} />
          )}
          {!projects?.nodes?.length && (
            <Grid item xs={12}>
              <NoProjectsCard title="No projects to display">
                <Typography variant="subtitle2">
                  You have not added any new projects yet!
                </Typography>
                <Typography variant="subtitle2">
                  Select the &quot;Add new project&quot; button below to get
                  started.
                </Typography>
              </NoProjectsCard>
            </Grid>
          )}
        </Grid>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withPage(async ({ apolloClient, locale }) => {
  const {
    props: {
      data: { projects }
    }
  } = await getServerPageGetProjects({}, apolloClient);

  const props = {
    projects,
    ...(await serverSideTranslations(locale, [
      "common",
      "sidebar",
      "footer",
      "project-page"
    ]))
  };

  return { props };
});

export default withPageAuthRequired(Projects);

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      nodes {
        id
        name
        technology
        startDate
        endDate
        siteAddress {
          town
          postcode
        }
      }
    }
  }
`;
