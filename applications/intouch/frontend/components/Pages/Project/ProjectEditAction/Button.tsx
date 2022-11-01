import { Button } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import AccessControl from "../../../../lib/permissions/AccessControl";
import { isProjectEditable } from "../../../../lib/utils/project";
import MaybeTooltip from "../../../MaybeTooltip";
import ProjectCopyAction from "../ProjectCopyAction/Button";
import { ProjectEditActionDialog } from "./Dialog";

type ProjectEditActionButtonProps = {
  project: GetProjectQuery["project"];
};

const ProjectEditAction = ({ project }: ProjectEditActionButtonProps) => {
  const { t } = useTranslation("project-page");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const isEditable = useMemo(() => isProjectEditable(project), [project]);

  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <div>
      <AccessControl
        dataModel="project"
        action="edit"
        extraData={{ isArchived: project.hidden }}
      >
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
        <ProjectEditActionDialog
          project={project}
          isOpen={isDialogOpen}
          onCloseClick={handleCloseDialog}
          onCompleted={handleCloseDialog}
        />
      </AccessControl>
      <ProjectCopyAction parentProject={project} />
    </div>
  );
};

export default ProjectEditAction;
