import React, { useState, useEffect } from "react";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { gql } from "@apollo/client";
import can from "../../lib/permissions/can";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../../lib/error";
import { withPage } from "../../lib/middleware/withPage";
import GridStyles from "../../styles/Grid.module.scss";
import { ProjectSidePanel } from "../../components/ProjectSidePanel";
import ProjectDetail from "../../components/ProjectDetail";
import { Layout } from "../../components/Layout";
import { NoProjectsCard } from "../../components/Cards/NoProjects";
import {
  GetProjectsQuery,
  GetGlobalDataQuery
} from "../../graphql/generated/operations";

import { getServerPageGetProjects } from "../../graphql/generated/page";

export type PageProps = {
  projects: GetProjectsQuery["projects"];
  globalPageData: GetGlobalDataQuery;
};

const Projects = ({ projects, globalPageData }: PageProps) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [activeProjectId, setActiveProjectId] = useState<number>(null);

  useEffect(() => {
    const { project } = router.query;
    if (project && project.length) {
      setActiveProjectId(parseInt(project[0]));
    }
  }, [router.query]);

  const sidePanelHandler = (projectId: number) => {
    //setActiveProjectId(projectId);
    router.push(`/projects/${projectId}`, undefined, { shallow: true });
  };

  return (
    <Layout title={t("Projects")} pageData={globalPageData}>
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

export const getServerSideProps = withPage(
  async ({ apolloClient, locale, account, globalPageData, res }) => {
    // TODO: Rename this function or reuse it at a different gate?
    if (!can(account, "page", "projects")) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(statusCode, {}, { globalPageData });
    }

    const {
      props: {
        data: { projects }
      }
    } = await getServerPageGetProjects({}, apolloClient);

    const props = {
      account,
      globalPageData,
      projects,
      ...(await serverSideTranslations(locale, [
        "common",
        "sidebar",
        "footer",
        "project-page"
      ]))
    };

    return { props };
  }
);

export default withPageAuthRequired(withPageError<ProjectsPageProps>(Projects));

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
