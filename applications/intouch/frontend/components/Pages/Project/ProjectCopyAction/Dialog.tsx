import { Dialog } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React from "react";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ProjectCopyActionDialog = ({ isOpen, onCancel, onConfirm }: Props) => {
  const { t } = useTranslation("project-page");

  return (
    <Dialog
      onCloseClick={onCancel}
      open={isOpen}
      data-testid="project-copy-dialog"
    >
      <Dialog.Title hasUnderline>{t("copyDialog.title")}</Dialog.Title>
      <Dialog.Content>{t("copyDialog.content")}</Dialog.Content>
      <Dialog.Actions
        confirmLabel={t("projectActions.cta.confirm")}
        onConfirmClick={onConfirm}
        cancelLabel={t("projectActions.cta.cancel")}
        onCancelClick={onCancel}
      />
    </Dialog>
  );
};

export default ProjectCopyActionDialog;
