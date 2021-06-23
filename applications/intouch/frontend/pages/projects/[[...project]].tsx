import React, { useState, useEffect } from "react";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import GridStyles from "../../styles/Grid.module.scss";
import { ProjectSidePanel } from "../../components/SidePanel/ProjectSidePanel";
import { getAuth0Instance } from "../../lib/auth0";
import { Layout } from "../../components/Layout";
import { NoProjectsCard } from "../../components/Cards/NoProjects";

import ProjectDetail from "./project-detail";

const projectDetails = [
  { id: 1, name: "Old Brompton Library", company: "JS Roofers" },
  { id: 2, name: "Kensington School", company: "Mark's Roofing" },
  { id: 3, name: "Greenwich Observatory", company: "Horizon Roofing Co" },
  { id: 4, name: "Camden Crown Pub", company: "JS Roofers" },
  { id: 5, name: "Leyton Sports Hall", company: "JS Roofers" }
];

const Projects = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [activeProjectId, setActiveProjectId] = useState<number>(null);

  useEffect(() => {
    const currentPath = router.query.project;

    if (currentPath) {
      setActiveProjectId(+currentPath[0]);
    }
  }, [router]);

  const sidePanelHandler = (projectId: number) => {
    setActiveProjectId(projectId);
  };

  return (
    <Layout title={t("Projects")}>
      <div style={{ display: "flex" }}>
        <ProjectSidePanel
          projectDetails={projectDetails}
          onProjectSelected={sidePanelHandler}
        />

        <Grid
          container
          spacing={3}
          className={GridStyles.outerGrid}
          alignItems="stretch"
        >
          {projectDetails.length > 0 && (
            <ProjectDetail projectId={activeProjectId} />
          )}
          {!projectDetails.length && (
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

export default withPageAuthRequired(Projects);
