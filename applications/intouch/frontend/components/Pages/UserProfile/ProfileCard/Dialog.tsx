import { Dialog } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React from "react";

export type DialogProps = {
  title: string;
  text: string;
  open: boolean;
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
      data-testid="reset-password-dialog"
    >
      <Dialog.Title hasUnderline>{t(dialogState.title)}</Dialog.Title>
      <Dialog.Content>{t(dialogState.text)}</Dialog.Content>
    </Dialog>
  );
};

export default ConfirmDialog;
