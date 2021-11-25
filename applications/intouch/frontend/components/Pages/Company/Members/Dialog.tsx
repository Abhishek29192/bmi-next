import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import TextField from "@bmi/text-field";
import Button from "@bmi/button";
import Dialog from "@bmi/dialog";
import Form from "@bmi/form";
import AlertBanner from "@bmi/alert-banner";
import { useInviteMutation } from "../../../../graphql/generated/hooks";

export const INVITE_USER = gql`
  mutation invite($input: InviteInput!) {
    invite(input: $input) {
      id
      invitee
      senderAccount {
        email
      }
    }
  }
`;

type AlertStateProp = {
  open: boolean;
  severity?: "error" | "warning" | "info" | "success";
  message?: string;
};

const InvitationDialog = ({ styles, dialogOpen, onCloseClick }: any) => {
  const { t } = useTranslation(["error-page", "team-page"]);
  const [alertState, setAlertState] = useState<AlertStateProp>({
    open: false
  });
  const [inviteUsers] = useInviteMutation({
    onError: (error) => {
      setAlertState({
        open: true,
        severity: "error",
        message: t(`error-page:${error.message}`)
      });
    },
    onCompleted: () =>
      setAlertState({
        open: true,
        severity: "success",
        message: t("team-page:invitation.dialog.success")
      })
  });

  const onSubmit = (event, values) => {
    event.preventDefault();
    inviteUsers({
      variables: {
        input: {
          emails: values.emails?.replace(/ /g, "")?.split(",") || [],
          personalNote: values.personalNote
        }
      }
    });
  };

  return (
    <Dialog
      onCloseClick={() => {
        setAlertState({ open: false });
        onCloseClick();
      }}
      className={styles.dialog}
      open={dialogOpen}
      data-testid="dialog"
    >
      <Dialog.Title hasUnderline>
        {t("team-page:invitation.dialog.title")}
      </Dialog.Title>
      <Dialog.Content>
        {alertState.open && (
          <AlertBanner severity={alertState.severity}>
            <AlertBanner.Title>{alertState.message}</AlertBanner.Title>
          </AlertBanner>
        )}
        <Form className={styles.form} onSubmit={onSubmit}>
          <Form.Row>
            <TextField
              name="emails"
              label={t("team-page:invitation.dialog.emails.label")}
              helperText={t("team-page:invitation.dialog.emails.helperText")}
              className={styles.input}
              inputProps={{
                ["data-testid"]: "emails"
              }}
              onChange={() => setAlertState({ open: false })}
              isRequired
              fullWidth
            />
            <TextField
              name="personalNote"
              label={t("team-page:invitation.dialog.personalNote.label")}
              className={styles.personalNote}
              onChange={() => setAlertState({ open: false })}
              inputProps={{
                ["data-testid"]: "personalNote"
              }}
              isRequired
              isTextArea
              fullWidth
              rows={6}
            />
          </Form.Row>
          <Form.ButtonWrapper>
            <Button
              onClick={onCloseClick}
              className={styles.cancel}
              variant="outlined"
              data-testid="invite-dialog-cancel"
            >
              {t("team-page:invitation.dialog.cancel")}
            </Button>
            <Form.SubmitButton data-testid="invite-dialog-submit">
              {t("team-page:invitation.dialog.send")}
            </Form.SubmitButton>
          </Form.ButtonWrapper>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};

export default InvitationDialog;
