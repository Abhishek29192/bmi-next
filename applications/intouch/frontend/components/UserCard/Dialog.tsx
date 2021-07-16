import React from "react";
import { useTranslation } from "next-i18next";
import Dialog from "@bmi/dialog";

export type DialogProps = {
  title: string;
  text: string;
  open: boolean;
  onConfirm: () => void;
};

type Props = {
  dialogState: DialogProps;
  onCancel: () => void;
};

const ConfirmDialog = ({ dialogState, onCancel }: Props) => {
  const { t } = useTranslation("team-page");

  return (
    <Dialog
      onCloseClick={onCancel}
      open={dialogState.open}
      data-testid="user-card-dialog"
    >
      <Dialog.Title hasUnderline>{t(dialogState.title)}</Dialog.Title>
      <Dialog.Content>{t(dialogState.text)}</Dialog.Content>
      <Dialog.Actions
        confirmLabel={t("confirm")}
        onConfirmClick={dialogState.onConfirm}
        cancelLabel={t("cancel")}
        onCancelClick={onCancel}
      />
    </Dialog>
  );
};

export default ConfirmDialog;
