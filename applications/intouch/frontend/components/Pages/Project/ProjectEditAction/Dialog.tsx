import React, { useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { Dialog } from "@bmi/components";
import { gql } from "@apollo/client";
import { ProjectSiteAddressIdFkeyInput } from "@bmi/intouch-api-types";
import { useUpdateProjectMutation } from "../../../../graphql/generated/hooks";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import { spreadObjectKeys } from "../../../../lib/utils/object";
import { findProjectGuarantee } from "../../../../lib/utils/project";
import log from "../../../../lib/logger";
import ProjectForm, { isFieldDisabled } from "../Form";
// TODO: move/split styles?
import styles from "../CreateProject/styles.module.scss";

type ProjectEditActionDialogProps = {
  project: GetProjectQuery["project"];
  isOpen: boolean;
  onCloseClick?: () => void;
  onCompleted?: () => void;
};

export const ProjectEditActionDialog = ({
  project,
  isOpen,
  onCloseClick,
  onCompleted
}: ProjectEditActionDialogProps) => {
  const { t } = useTranslation();
  const guarantee = findProjectGuarantee(project);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateProject] = useUpdateProjectMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error updating a project: ${error.toString()}`
      });
      // TODO: show some visual error
      setIsSubmitting(false);
    },
    onCompleted: ({ updateProject: { project } }) => {
      log({
        severity: "INFO",
        message: `Updated project - id: ${project.id}`
      });

      onCompleted && onCompleted();
      setIsSubmitting(false);
    }
  });

  const onSubmit = useCallback((event, values) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    // we need to account for nested objects (e.g. address)
    const valuesObject = spreadObjectKeys(values, (key, value) => {
      // skip disabled fields
      if (isFieldDisabled(guarantee, key)) {
        return undefined;
      }

      if (key === "roofArea") {
        return Number.parseInt(value);
      }

      return value;
    });

    const { siteAddress, ...createProjectValues } = valuesObject;

    // siteAddress may have been disabled therefore not in the filtered form values
    const addressToSiteAddressId: ProjectSiteAddressIdFkeyInput = siteAddress
      ? project.siteAddress?.id
        ? {
            // updates the address (already linked to the project)
            updateById: {
              id: project?.siteAddress.id,
              patch: siteAddress
            }
          }
        : {
            // creates the address and links it to the project
            create: siteAddress
          }
      : undefined;

    updateProject({
      variables: {
        input: {
          id: project.id,
          patch: {
            ...createProjectValues,
            addressToSiteAddressId
          }
        }
      }
    });
  }, []);

  return (
    <Dialog
      className={styles.dialog}
      open={isOpen}
      onCloseClick={onCloseClick}
      disablePortal={false}
    >
      <Dialog.Title hasUnderline>
        {t("project-page:addProject.dialog.title")}
      </Dialog.Title>

      <Dialog.Content className={styles.dialogContent}>
        <ProjectForm
          project={project}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </Dialog.Content>
    </Dialog>
  );
};

export const UPDATE_PROJET = gql`
  mutation updateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      project {
        ...ProjectDetailsFragment
      }
    }
  }
`;
