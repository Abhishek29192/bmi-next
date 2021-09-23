import React, { useMemo } from "react";
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
import { GlobalPageProps, withPage } from "../../lib/middleware/withPage";
import GridStyles from "../../styles/Grid.module.scss";
import { ProjectSidePanel } from "../../components/ProjectSidePanel";
import ProjectDetail from "../../components/ProjectDetail";
import { Layout } from "../../components/Layout";
import { NoProjectsCard } from "../../components/Cards/NoProjects";
import { GetProjectsQuery } from "../../graphql/generated/operations";

import { getServerPageGetProjects } from "../../graphql/generated/page";
import { isSuperOrMarketAdmin } from "../../lib/account";

export type ProjectsPageProps = GlobalPageProps & {
  projects: GetProjectsQuery["projects"];
  isPowerfulUser: boolean;
};

const sortProjects = (
  projects: GetProjectsQuery["projects"]["nodes"],
  isPowerfulUser: boolean
) => {
  const now = Date.now();
  return [...(projects || [])].sort((a, b) => {
    return isPowerfulUser
      ? a.name.localeCompare(b.name)
      : Math.abs(now - new Date(a.endDate).getTime()) -
          Math.abs(now - new Date(b.endDate).getTime());
  });
};

const Projects = ({
  projects,
  isPowerfulUser,
  globalPageData
}: ProjectsPageProps) => {
  const { t } = useTranslation(["common", "project-page"]);
  const router = useRouter();

  const sortedProjects = useMemo(
    () => sortProjects(projects?.nodes, isPowerfulUser),
    [projects?.nodes]
  );

  const activeProjectId = useMemo(() => {
    const { project } = router.query;
    if (project && project.length) {
      return parseInt(project[0]);
    }
  }, [router.query, sortedProjects]);

  const handleProjectSelection = (projectId: number) => {
    router.push(`/projects/${projectId}`, undefined, { shallow: true });
  };

  return (
    <Layout title={t("common:Projects")} pageData={globalPageData}>
      <div style={{ display: "flex", height: "100%" }}>
        <ProjectSidePanel
          projects={sortedProjects}
          onProjectSelected={handleProjectSelection}
          selectedProjectId={activeProjectId}
        />

        <Grid
          container
          spacing={3}
          className={GridStyles.outerGrid}
          alignItems="stretch"
        >
          {sortedProjects.length === 0 ? (
            <Grid item xs={12}>
              <NoProjectsCard title={t("project-page:noProjects.title")}>
                <Typography variant="subtitle2">
                  {t("project-page:noProjects.body1")}
                </Typography>
                <Typography variant="subtitle2">
                  {t("project-page:noProjects.body2")}
                </Typography>
              </NoProjectsCard>
            </Grid>
          ) : (
            <ProjectDetail projectId={activeProjectId} />
          )}
        </Grid>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({ apolloClient, locale, account, globalPageData, res, params }) => {
    // Check if user can generally access the page
    if (!can(account, "page", "projects")) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(statusCode, {}, { globalPageData });
    }

    // Retrieve all the projects accessible to the user
    const {
      props: {
        data: { projects }
      }
    } = await getServerPageGetProjects({}, apolloClient);

    const isPowerfulUser = isSuperOrMarketAdmin(account);

    // If trying to access a specific project, check if it's accessible
    if (params?.project && params?.project.length) {
      const found = projects?.nodes.find(
        ({ id }) => id === parseInt(params.project[0])
      );

      if (!found) {
        const statusCode = ErrorStatusCode.NOT_FOUND;
        res.statusCode = statusCode;
        return generatePageError(statusCode, {}, { globalPageData });
      }
      // Otherwise, redirect to first accessible project, if any
    } else if (projects?.nodes.length) {
      const sortedProjects = sortProjects(projects?.nodes, isPowerfulUser);
      return {
        redirect: {
          permanent: false,
          destination: `/projects/${sortedProjects[0]?.id}`
        }
      };
    }

    return {
      props: {
        projects,
        isPowerfulUser,
        ...(await serverSideTranslations(locale, [
          "common",
          "sidebar",
          "footer",
          "project-page"
        ]))
      }
    };
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
        company {
          name
        }
        guarantees(first: 1) {
          nodes {
            coverage
            status
            reviewerAccountId
          }
        }
      }
    }
  }
`;
