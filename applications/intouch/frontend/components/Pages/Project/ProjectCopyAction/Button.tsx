import { Button } from "@bmi-digital/components";
import {
  ProjectCompanyIdFkeyInput,
  ProjectSiteAddressIdFkeyInput
} from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useCreateProjectMutation } from "../../../../graphql/generated/hooks";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import log from "../../../../lib/logger";
import AccessControl from "../../../../lib/permissions/AccessControl";
import {
  copyOfBuildingOwnerAddress,
  copyOfSiteAddress
} from "../../../../lib/utils/address";
import ProjectCopyActionDialog from "./Dialog";

type ProjectCopyActionButtonProps = {
  parentProject: GetProjectQuery["project"];
};

const ProjectCopyAction = ({ parentProject }: ProjectCopyActionButtonProps) => {
  const { t } = useTranslation("project-page");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleCloseDialog = () => setDialogOpen(false);

  const router = useRouter();

  const [createProject] = useCreateProjectMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error creating a project: ${error.toString()}`
      });
    },
    onCompleted: ({ createProject: { project } }) => {
      log({
        severity: "INFO",
        message: `Created project - id: ${project.id}`
      });

      // Once we can update the cache perhaps we can `shallow: true`
      // at which point closing it makes sense.
      handleCloseDialog && handleCloseDialog();
      router.push(`/projects/${project.id}`, undefined, { shallow: false });
    }
  });

  const onSubmit = useCallback(() => {
    const companyToCompanyId: ProjectCompanyIdFkeyInput = {
      connectById: {
        id: parentProject.company.id
      }
    };

    const addressToSiteAddressId: ProjectSiteAddressIdFkeyInput = {
      // Creates the Site address and links it to the project.
      create: copyOfSiteAddress(parentProject.siteAddress)
    };

    const addressToBuildingOwnerAddressId: ProjectSiteAddressIdFkeyInput = {
      // Creates the BuildingOwner address and links it to the project.
      create: copyOfBuildingOwnerAddress(parentProject.buildingOwnerAddress)
    };
    const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const {
      __typename,
      id,
      company,
      evidenceItems,
      notes,
      projectMembers,
      guarantees,
      siteAddress,
      buildingOwnerAddress,
      ...projectClone
    } = {
      ...parentProject,
      name: t("copyDialog.copyOf", {
        name: parentProject.name
      }),
      hidden: false,
      endDate: today,
      startDate: today,
      companyToCompanyId,
      addressToSiteAddressId,
      addressToBuildingOwnerAddressId
    };

    createProject({
      variables: {
        input: {
          project: {
            ...projectClone
          }
        }
      }
    });
  }, [parentProject]);

  return (
    <AccessControl
      dataModel="project"
      action="copy"
      extraData={{ isArchived: parentProject.hidden }}
    >
      <Button variant="text" onClick={() => setDialogOpen(true)}>
        {t(`projectDetails.cta.copy`)}
      </Button>
      <ProjectCopyActionDialog
        isOpen={isDialogOpen}
        onCancel={handleCloseDialog}
        onConfirm={onSubmit}
      />
    </AccessControl>
  );
};

export default ProjectCopyAction;
