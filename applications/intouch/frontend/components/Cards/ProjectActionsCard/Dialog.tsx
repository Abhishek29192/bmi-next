import React from "react";
import { useTranslation } from "next-i18next";
import { Dialog } from "@bmi/components";

export type DialogProps = {
  title: string;
  description: string;
  open: boolean;
  onConfirm: () => void;
};

type Props = {
  dialogState: DialogProps;
  onCancel: () => void;
};

const ConfirmDialog = ({ dialogState, onCancel }: Props) => {
  const { t } = useTranslation("project-page");

  return (
    <Dialog
      onCloseClick={onCancel}
      open={dialogState.open}
      data-testid="project-details-dialog"
    >
      <Dialog.Title hasUnderline>{t(dialogState.title)}</Dialog.Title>
      <Dialog.Content>{t(dialogState.description)}</Dialog.Content>
      <Dialog.Actions
        confirmLabel={t("projectActions.cta.confirm")}
        onConfirmClick={dialogState.onConfirm}
        cancelLabel={t("projectActions.cta.cancel")}
        onCancelClick={onCancel}
      />
    </Dialog>
  );
};

export default ConfirmDialog;
