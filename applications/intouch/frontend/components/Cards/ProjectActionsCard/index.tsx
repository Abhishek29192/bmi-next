import React from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import Card, { CardContent, CardActions } from "@bmi/card";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import { useUpdateProjectHiddenMutation } from "../../../graphql/generated/hooks";
import log from "../../../lib/logger";
import styles from "./styles.module.scss";

type ProjectActionsCardProps = {
  projectId: number;
  isArchived?: boolean;
};

export const ProjectActionsCard = ({
  projectId,
  isArchived
}: ProjectActionsCardProps) => {
  const { t } = useTranslation("project-page");

  const [updateProjectHidden] = useUpdateProjectHiddenMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error updating project hidden status: ${error.toString()}`
      });
    },
    onCompleted: ({ updateProject: { project } }) => {
      log({
        severity: "INFO",
        message: `Project ID [${project.id}] hidden toggled to ${project.hidden}`
      });
    }
  });

  const toggleProjectArchive = () => {
    updateProjectHidden({
      variables: {
        projectId,
        hidden: !isArchived
      }
    });
  };

  return (
    <Card className={styles.main}>
      <CardContent>
        <Typography variant="h5" className={styles.heading}>
          {t("projectActions.heading")}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="outlined" onClick={toggleProjectArchive}>
          {isArchived
            ? t("projectActions.cta.unarchive")
            : t("projectActions.cta.archive")}
        </Button>
        <Button variant="outlined">
          {t("projectActions.cta.requestInformation")}
        </Button>
        <Button>{t("projectActions.cta.approveGuarantee")}</Button>
      </CardActions>
    </Card>
  );
};

export const UpdateProjectHidden = gql`
  mutation UpdateProjectHidden($projectId: Int!, $hidden: Boolean!) {
    updateProject(input: { id: $projectId, patch: { hidden: $hidden } }) {
      project {
        id
        hidden
      }
    }
  }
`;
