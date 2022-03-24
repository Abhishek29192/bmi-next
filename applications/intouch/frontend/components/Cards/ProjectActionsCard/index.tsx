import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { Card, CardContent, CardActions } from "@bmi/components";
import { Typography } from "@bmi/components";
import { Button } from "@bmi/components";
import { GuaranteeEventType } from "@bmi/intouch-api-types";
import { useUpdateProjectHiddenMutation } from "../../../graphql/generated/hooks";
import log from "../../../lib/logger";
import styles from "./styles.module.scss";
import Dialog, { DialogProps } from "./Dialog";

type ProjectActionsCardProps = {
  projectId: number;
  isArchived?: boolean;
  guaranteeEventHandler?: (eventType: GuaranteeEventType) => void;
};

export const ProjectActionsCard = ({
  projectId,
  isArchived,
  guaranteeEventHandler
}: ProjectActionsCardProps) => {
  const { t } = useTranslation("project-page");
  const [dialogState, setDialogState] = useState<DialogProps>({
    open: false,
    title: null,
    description: null,
    onConfirm: null
  });

  const closeDialog = () => {
    setDialogState((prev) => ({
      ...prev,
      open: false
    }));
  };

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
        {guaranteeEventHandler && (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                setDialogState({
                  open: true,
                  title: t("guaranteeApprovalAlert.reject.title"),
                  description: t("guaranteeApprovalAlert.reject.description"),
                  onConfirm: () => {
                    guaranteeEventHandler("REJECT_SOLUTION");
                    closeDialog();
                  }
                });
              }}
            >
              {t("projectActions.cta.requestInformation")}
            </Button>
            <Button
              onClick={() => {
                setDialogState({
                  open: true,
                  title: t("guaranteeApprovalAlert.confirm.title"),
                  description: t("guaranteeApprovalAlert.confirm.description"),
                  onConfirm: () => {
                    guaranteeEventHandler("APPROVE_SOLUTION");
                    closeDialog();
                  }
                });
              }}
            >
              {t("projectActions.cta.approveGuarantee")}
            </Button>
          </>
        )}
        {open && <Dialog dialogState={dialogState} onCancel={closeDialog} />}
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
