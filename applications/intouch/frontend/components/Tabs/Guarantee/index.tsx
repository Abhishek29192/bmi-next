import React, { useState } from "react";
import Button from "@bmi/button";
import { useTranslation } from "next-i18next";
import { NoContent } from "../../NoContent";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import styles from "./styles.module.scss";
import { ApplyGuaranteeDialog } from "./ApplyGuaranteeDialog";

export type GuaranteeTabProps = {
  project: GetProjectQuery["project"];
};

export const GuaranteeTab = ({ project }: GuaranteeTabProps) => {
  const { t } = useTranslation("project-page");
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Button onClick={() => setDialogOpen(true)}>
          {t("guarantee_tab.header")}
        </Button>
      </div>
      <div className={styles.body}>
        <NoContent message={t("guarantee_tab.nocontent_message")} />
      </div>
      {project && (
        <ApplyGuaranteeDialog
          isOpen={isDialogOpen}
          project={project}
          onCloseClick={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};
