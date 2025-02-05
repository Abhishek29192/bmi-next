import Dialog from "@bmi-digital/components/dialog";
import Typography from "@bmi-digital/components/typography";
import { microCopy } from "@bmi/microcopies";
import GlobalStyles from "@mui/material/GlobalStyles";
import { modalClasses } from "@mui/material/Modal";
import { useRouter } from "next/navigation";
import React from "react";
import { useSiteContext } from "../../../components/Site";
import { StyledDialog } from "./WarningDialogStyles";

export type WarningDialogProps = {
  blockedUrl: string;
  closeDialog: () => void;
};

const WarningDialog = (props: WarningDialogProps) => {
  const { getMicroCopy } = useSiteContext();
  const router = useRouter();

  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            paddingRight: "0 !important"
          },
          [`.${modalClasses.root}`]: {
            maxWidth: "100vw !important",
            maxHeight: "100vh"
          }
        }}
      />
      <StyledDialog
        open={true}
        data-testid="warning-dialog"
        onCloseClick={props.closeDialog}
      >
        <Dialog.Title hasUnderline variant="h4">
          {getMicroCopy(microCopy.TRAINING_REGISTRATION_WARNING_POPUP_TITLE)}
        </Dialog.Title>
        <Dialog.Content>
          <Typography data-testid="warning-dialog-description">
            {getMicroCopy(
              microCopy.TRAINING_REGISTRATION_WARNING_POPUP_DESCRIPTION
            )}
          </Typography>
        </Dialog.Content>
        <Dialog.Actions
          cancelLabel={getMicroCopy(
            microCopy.TRAINING_REGISTRATION_WARNING_POPUP_CANCEL_BTN
          )}
          confirmLabel={getMicroCopy(
            microCopy.TRAINING_REGISTRATION_WARNING_POPUP_CLOSE_BTN
          )}
          onCancelClick={props.closeDialog}
          onConfirmClick={() => router.push(props.blockedUrl)}
        />
      </StyledDialog>
    </>
  );
};

export default WarningDialog;
