import Dialog from "@bmi-digital/components/dialog";
import Typography from "@bmi-digital/components/typography";
import React, { useEffect, useState } from "react";
import { StyledDialog } from "./RegistrationCompletedDialogStyles";

export type RegistrationCompetedDialogProps = {
  title?: string;
  description?: string;
  closeButtonLabel?: string;
  open?: boolean;
};

const RegistrationCompetedDialog = (props: RegistrationCompetedDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (props.open) {
      setIsOpen(true);
    }
  }, [props.open]);

  return (
    <StyledDialog
      open={isOpen}
      data-testid="registration-completed-dialog"
      onCloseClick={() => setIsOpen(false)}
    >
      <Dialog.Title hasUnderline variant="h4">
        {props.title}
      </Dialog.Title>
      <Dialog.Content>
        <Typography data-testid="registration-completed-dialog-description">
          {props.description}
        </Typography>
      </Dialog.Content>
      <Dialog.Actions
        confirmLabel={props.closeButtonLabel}
        onConfirmClick={() => setIsOpen(false)}
      />
    </StyledDialog>
  );
};

export default RegistrationCompetedDialog;
