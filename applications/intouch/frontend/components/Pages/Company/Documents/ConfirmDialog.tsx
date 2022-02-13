import React from "react";
import { useTranslation } from "next-i18next";
import Dialog from "@bmi-digital/components/dialog";

export type ConfirmDialogState = {
  isOpen: boolean;
  id?: number;
};
export type ConfirmDialogProps = {
  state: ConfirmDialogState;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog = ({ state, onConfirm, onCancel }: ConfirmDialogProps) => {
  const { t } = useTranslation("company-page");

  return (
    <Dialog onCloseClick={onCancel} open={state.isOpen}>
      <Dialog.Title hasUnderline>
        {t("document.confirmDialog.title")}
      </Dialog.Title>
      <Dialog.Content>{t("document.confirmDialog.body")}</Dialog.Content>
      <Dialog.Actions
        confirmLabel={t("document.confirmDialog.confirmLabel")}
        onConfirmClick={onConfirm}
        cancelLabel={t("document.confirmDialog.cancelLabel")}
        onCancelClick={onCancel}
        data-testid="company-document-confirm-dialog"
      />
    </Dialog>
  );
};

export default ConfirmDialog;
