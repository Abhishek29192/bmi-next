import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import AccessControl from "../../../../lib/permissions/AccessControl";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import { ProjectEditActionDialog } from "./Dialog";

type ProjectEditActionButtonProps = {
  project: GetProjectQuery["project"];
};

const ProjectEditAction = ({ project }: ProjectEditActionButtonProps) => {
  const { t } = useTranslation("project-page");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <AccessControl dataModel="project" action="edit">
      <Button variant="text" onClick={() => setDialogOpen(true)}>
        {t(`projectDetails.cta.edit`)}
      </Button>
      <ProjectEditActionDialog
        project={project}
        isOpen={isDialogOpen}
        onCloseClick={handleCloseDialog}
        onCompleted={handleCloseDialog}
      />
    </AccessControl>
  );
};

export default ProjectEditAction;
