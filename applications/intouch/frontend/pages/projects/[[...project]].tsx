import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Grid } from "@bmi/components";
import { Typography } from "@bmi/components";
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
import layoutStyles from "../../components/Layout/styles.module.scss";
import { NoProjectsCard } from "../../components/Cards/NoProjects";
import { GetProjectsQuery } from "../../graphql/generated/operations";
import { useGetProjectsLazyQuery } from "../../graphql/generated/hooks";
import { getServerPageGetProjects } from "../../graphql/generated/page";
import { isSuperOrMarketAdmin } from "../../lib/account";
import { useMarketContext } from "../../context/MarketContext";
import ProjectPageContextWrapper from "../../context/ProjectPageContext";

export type ProjectsPageProps = GlobalPageProps & {
  projects: GetProjectsQuery["projectsByMarket"];
  isPowerfulUser: boolean;
};

const sortProjects = (
  projects: GetProjectsQuery["projectsByMarket"]["nodes"],
  isPowerfulUser: boolean
) => {
  const now = Date.now();
  return [...(projects || [])].sort((a, b) => {
    return isPowerfulUser
      ? a.name?.localeCompare(b.name)
      : Math.abs(now - new Date(a.endDate).getTime()) -
          Math.abs(now - new Date(b.endDate).getTime());
  });
};

const Projects = ({
  projects: ssrProjects,
  isPowerfulUser,
  globalPageData
}: ProjectsPageProps) => {
  const router = useRouter();
  const { market } = useMarketContext();

  const [projects, setProjects] =
    useState<GetProjectsQuery["projectsByMarket"]>(ssrProjects);

  const { t } = useTranslation(["common", "project-page"]);

  const [getProjects] = useGetProjectsLazyQuery({
    variables: {
      market: market.id
    },
    onCompleted: ({ projectsByMarket }) => {
      setProjects(projectsByMarket);
    }
  });

  const sortedProjects = useMemo(
    () => sortProjects(projects.nodes, isPowerfulUser),
    [projects.nodes]
  );

  const activeProject = useMemo(() => {
    const { project } = router.query;
    if (project && project.length) {
      return parseInt(project[0]);
    }
  }, [router.query]);

  const handleProjectSelection = (projectId: number) => {
    router.push(`/projects/${projectId}`, undefined, { shallow: true });
  };

  const getProjectsCallBack = useCallback(() => getProjects(), [getProjects]);

  useEffect(() => {
    getProjectsCallBack();
  }, [activeProject]);

  return (
    <Layout title={t("common:Projects")} pageData={globalPageData}>
      <ProjectPageContextWrapper
        value={{
          getProjectsCallBack
        }}
      >
        <div className={layoutStyles.sidePanelWrapper}>
          <ProjectSidePanel
            projects={sortedProjects}
            onProjectSelected={handleProjectSelection}
            selectedProjectId={activeProject}
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
              <ProjectDetail
                projectId={activeProject}
                onUpdateGuarantee={getProjectsCallBack}
              />
            )}
          </Grid>
        </div>
      </ProjectPageContextWrapper>
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({
    apolloClient,
    locale,
    account,
    globalPageData,
    res,
    market,
    params
  }) => {
    const translations = await serverSideTranslations(locale, [
      "common",
      "sidebar",
      "footer",
      "project-page",
      "error-page"
    ]);

    // Check if user can generally access the page
    if (!can(account, "page", "projects")) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(
        statusCode,
        {},
        { globalPageData, ...translations }
      );
    }

    // Retrieve all the projects accessible to the user
    const {
      props: {
        data: { projectsByMarket }
      }
    } = await getServerPageGetProjects(
      {
        variables: {
          market: market.id
        }
      },
      apolloClient
    );

    const isPowerfulUser = isSuperOrMarketAdmin(account);

    // If trying to access a specific project, check if it's accessible
    if (params.project) {
      const found = projectsByMarket?.nodes.find(
        ({ id }) => id === parseInt(params.project)
      );

      /* istanbul ignore else */
      if (!found) {
        const statusCode = ErrorStatusCode.NOT_FOUND;
        res.statusCode = statusCode;
        return generatePageError(
          statusCode,
          {},
          { globalPageData, ...translations }
        );
      }
      // Otherwise, redirect to first accessible project, if any
    } else if (projectsByMarket?.nodes.length) {
      const sortedProjects = sortProjects(
        projectsByMarket.nodes,
        isPowerfulUser
      );
      return {
        redirect: {
          permanent: false,
          destination: `/projects/${sortedProjects[0].id}`
        }
      };
    }

    return {
      props: {
        projects: projectsByMarket,
        isPowerfulUser,
        ...translations
      }
    };
  }
);

export default withPageAuthRequired(withPageError<ProjectsPageProps>(Projects));

export const GET_PROJECTS = gql`
  query GetProjects($market: Int!) {
    projectsByMarket(market: $market) {
      nodes {
        id
        name
        technology
        startDate
        endDate
        buildingOwnerFirstname
        buildingOwnerLastname
        buildingOwnerCompany
        buildingOwnerMail
        siteAddress {
          town
          postcode
        }
        company {
          name
          status
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
