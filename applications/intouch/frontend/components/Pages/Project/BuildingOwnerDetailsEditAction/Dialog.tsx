import { Dialog } from "@bmi-digital/components";
import {
  Project,
  ProjectBuildingOwnerAddressIdFkeyInput
} from "@bmi/intouch-api-types";
import { DeepPartial } from "applications/intouch/frontend/lib/utils/types";
import { useTranslation } from "next-i18next";
import React, { useCallback } from "react";
import { useUpdateProjectMutation } from "../../../../graphql/generated/hooks";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import log from "../../../../lib/logger";
import { spreadObjectKeys } from "../../../../lib/utils/object";
import { findProjectGuarantee } from "../../../../lib/utils/project";
import BuildingOwnerForm from "../BuildingOwnerForm";
// TODO: move/split styles?
import styles from "../CreateProject/styles.module.scss";
import { isFieldDisabled } from "../Form";

type BuildingOwnerDetailsEditDialogProps = {
  project: GetProjectQuery["project"];
  isOpen: boolean;
  onCloseClick?: () => void;
  onCompleted?: () => void;
};

export const BuildingOwnerDetailsEditDialog = ({
  project,
  isOpen,
  onCloseClick,
  onCompleted
}: BuildingOwnerDetailsEditDialogProps) => {
  const { t } = useTranslation();
  const guarantee = findProjectGuarantee(project as DeepPartial<Project>);

  const [updateProject, { loading: isSubmitting }] = useUpdateProjectMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error updating project building owner details: ${error.toString()}`
      });
    },
    onCompleted: ({ updateProject: { project } }) => {
      log({
        severity: "INFO",
        message: `Updated project building owner details - project.id: ${project.id}`
      });

      onCompleted && onCompleted();
    }
  });

  const onSubmit = useCallback((event, values) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    // we need to account for nested objects (e.g. address)
    const valuesObject = spreadObjectKeys(values, (key, value) => {
      // skip disabled fields
      if (isFieldDisabled(guarantee, key)) {
        return undefined;
      }

      return value;
    });

    const { buildingOwnerAddress, ...createProjectValues } = valuesObject;

    // buildingOwnerAddress may have been disabled therefore not in the filtered form values
    const addressToBuildingOwnerAddressId: ProjectBuildingOwnerAddressIdFkeyInput =
      buildingOwnerAddress
        ? project?.buildingOwnerAddress?.id
          ? {
              // updates the address (already linked to the project)
              updateById: {
                id: project.buildingOwnerAddress.id,
                patch: buildingOwnerAddress
              }
            }
          : {
              // creates the address and links it to the project
              create: buildingOwnerAddress
            }
        : undefined;

    updateProject({
      variables: {
        input: {
          id: project.id,
          patch: {
            ...createProjectValues,
            addressToBuildingOwnerAddressId
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
        {t("project-page:buildingOwnerDetails.edit.title")}
      </Dialog.Title>

      <Dialog.Content className={styles.dialogContent}>
        <BuildingOwnerForm
          key="building-owner-form"
          project={project}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </Dialog.Content>
    </Dialog>
  );
};
