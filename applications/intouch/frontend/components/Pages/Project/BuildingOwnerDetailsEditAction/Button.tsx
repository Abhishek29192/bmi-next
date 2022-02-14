import React, { useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi-digital/components/button";
import MaybeTooltip from "../../../MaybeTooltip";
import AccessControl from "../../../../lib/permissions/AccessControl";
import { isProjectEditable } from "../../../../lib/utils/project";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import { BuildingOwnerDetailsEditDialog } from "./Dialog";

type BuildingOwnerDetailsEditButtonProps = {
  project: GetProjectQuery["project"];
};

const BuildingOwnerDetailsEditButton = ({
  project
}: BuildingOwnerDetailsEditButtonProps) => {
  const { t } = useTranslation("project-page");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const isEditable = useMemo(() => isProjectEditable(project), [project]);

  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <AccessControl dataModel="project" action="edit">
      <MaybeTooltip
        title={t("projectDetails.hints.projectEditGuaranteeStatus")}
        placement="top-end"
        arrow
        show={!isEditable}
      >
        <Button
          variant="text"
          onClick={() => setDialogOpen(true)}
          disabled={!isEditable}
        >
          {t(`projectDetails.cta.edit`)}
        </Button>
      </MaybeTooltip>
      <BuildingOwnerDetailsEditDialog
        project={project}
        isOpen={isDialogOpen}
        onCloseClick={handleCloseDialog}
        onCompleted={handleCloseDialog}
      />
    </AccessControl>
  );
};

export default BuildingOwnerDetailsEditButton;
