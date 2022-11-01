import { Button } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";
import { useAccountContext } from "../../../context/AccountContext";
import { findAccountCompany } from "../../../lib/account";
import AccessControl from "../../../lib/permissions/AccessControl";
import { NewProjectDialog } from "../../Pages/Project/CreateProject/Dialog";
import { GuaranteeReport, ProjectReport, UploadReport } from "../../Reports";
import styles from "../styles.module.scss";

export const ProjectSidePanelFooter = () => {
  const { t } = useTranslation("project-page");
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const { account } = useAccountContext();
  const currentCompany = useMemo(() => findAccountCompany(account), [account]);

  const handleOnNewProject = () => {
    setIsNewProjectDialogOpen(true);
  };

  const handleOnDialogClose = () => {
    setIsNewProjectDialogOpen(false);
  };

  if (!currentCompany) {
    return null;
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOnNewProject}
        data-testid="project-side-panel-footer-button"
        fullWidth
      >
        {t("addProject.cta")}
      </Button>
      <NewProjectDialog
        companyId={currentCompany.id}
        isOpen={isNewProjectDialogOpen}
        onCloseClick={handleOnDialogClose}
        onCompleted={handleOnDialogClose}
      />
    </>
  );
};

export default function SidePanelFooter({
  projectLength,
  guaranteeLength
}: {
  projectLength: number;
  guaranteeLength: number;
}) {
  return (
    <div className={styles["sidePanelFooter"]}>
      <AccessControl dataModel="project" action="addProject">
        <ProjectSidePanelFooter />
      </AccessControl>
      <AccessControl dataModel="project" action="downloadReport">
        <ProjectReport disabled={projectLength === 0} />
      </AccessControl>
      <AccessControl dataModel="project" action="downloadGuaranteeReport">
        <GuaranteeReport disabled={guaranteeLength === 0} />
      </AccessControl>
      <AccessControl dataModel="project" action="downloadProjectUploadReport">
        <UploadReport disabled={projectLength === 0} />
      </AccessControl>
    </div>
  );
}
