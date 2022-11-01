import { Dialog } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React from "react";

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
        confirmLabel={t("user_card.confirm")}
        onConfirmClick={dialogState.onConfirm}
        cancelLabel={t("user_card.cancel")}
        onCancelClick={onCancel}
      />
    </Dialog>
  );
};

export default ConfirmDialog;
