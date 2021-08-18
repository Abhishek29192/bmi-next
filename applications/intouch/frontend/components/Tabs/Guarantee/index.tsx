import React, { useState } from "react";
import Button from "@bmi/button";
import Modal from "@bmi/dialog";
import { useTranslation } from "next-i18next";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import styles from "./styles.module.scss";
import { ApplyGuaranteeDialog } from "./ApplyGuaranteeDialog";
import { ProjectGuarantee } from "./ProjectGuarantee";

export type GuaranteeTabProps = {
  project: GetProjectQuery["project"];
};

export const GuaranteeTab = ({ project }: GuaranteeTabProps) => {
  const { t } = useTranslation("project-page");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const { guarantees } = project;

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Button onClick={() => setDialogOpen(true)}>
          {t("guarantee_tab.header")}
        </Button>
      </div>
      <div className={styles.body}>
        <ProjectGuarantee guarantees={guarantees.nodes} />
      </div>
      <ApplyGuaranteeDialog
        isOpen={isDialogOpen}
        project={project}
        onCloseClick={() => setDialogOpen(false)}
        onCompletedClick={() => {
          setDialogOpen(false);
          setModalOpen(true);
        }}
      />
      <Modal open={isModalOpen} onCloseClick={() => setModalOpen(false)}>
        <Modal.Title hasUnderline>
          {t("guarantee_tab.dialog.title")}
        </Modal.Title>
        <Modal.Content>{t("guarantee_tab.dialog.description")}</Modal.Content>
        <Modal.Actions
          confirmLabel={t("guarantee_tab.dialog.confirm_label")}
          onConfirmClick={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
