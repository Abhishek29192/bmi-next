import React, { useState } from "react";
import Button from "@bmi/button";
import Modal from "@bmi/dialog";
import { useTranslation } from "next-i18next";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import { checkProjectGuaranteeReview } from "../../../lib/utils/project";
import { isGuaranteeApplicationEnable } from "../../../lib/utils/guarantee";
import styles from "./styles.module.scss";
import { ApplyGuaranteeDialog } from "./ApplyGuaranteeDialog";
import { ProjectGuarantee } from "./ProjectGuarantee";
import SolutionGuaranteeReviewDialog from "./SolutionGuaranteeReviewDialog";

export type GuaranteeTabProps = {
  project: GetProjectQuery["project"];
  isApplyGuarantee: boolean;
};

export const GuaranteeTab = ({
  project,
  isApplyGuarantee
}: GuaranteeTabProps) => {
  const { t } = useTranslation("project-page");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isReviewOpen, setReviewOpen] = useState(false);

  const { guarantees } = project;

  const guaranteeApplicationEnable = isGuaranteeApplicationEnable(project);

  return (
    <div className={styles.main}>
      {isApplyGuarantee && (
        <div className={styles.header}>
          <Button
            onClick={() => setDialogOpen(true)}
            disabled={!guaranteeApplicationEnable}
          >
            {t("guarantee_tab.header")}
          </Button>
        </div>
      )}

      <div className={styles.body}>
        <ProjectGuarantee
          guarantees={guarantees.nodes}
          onReviewClick={() => setReviewOpen(true)}
          canGuaranteeBeSubmitted={checkProjectGuaranteeReview(project)}
        />
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
      <SolutionGuaranteeReviewDialog
        isOpen={isReviewOpen}
        project={project}
        onCloseClick={() => setReviewOpen(false)}
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
