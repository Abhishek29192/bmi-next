import React, { useState } from "react";
import { gql } from "@apollo/client";
import validator from "validator";
import { useTranslation } from "next-i18next";
import { withStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@bmi-digital/components/text-field";
import Button from "@bmi-digital/components/button";
import Dialog from "@bmi-digital/components/dialog";
import Form from "@bmi-digital/components/form";
import AlertBanner from "@bmi-digital/components/alert-banner";
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

const WhiteAutocomplete = withStyles({
  inputRoot: {
    backgroundColor: "white"
  }
})(Autocomplete);

const InvitationDialog = ({ styles, dialogOpen, onCloseClick }: any) => {
  const { t } = useTranslation(["error-page", "team-page"]);
  const [alertState, setAlertState] = useState<AlertStateProp>({
    open: false
  });
  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [inviteUsers, { loading }] = useInviteMutation({
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
          emails: emails || []
        }
      }
    });
  };

  const onInputChange = (event, newInputValue) => {
    const options = newInputValue.split(",");
    if (options.length > 1) {
      setEmails(
        emails
          .concat(options)
          .map((x) => x.trim())
          .filter((x) => {
            return x && validator.isEmail(x);
          })
          .slice(0, 10)
      );
    } else {
      setInputValue(newInputValue);
    }
  };

  const onChange = (event, newValue: string[]) => {
    setEmails(
      newValue
        .map((x) => x.trim())
        .filter((x) => {
          return x && validator.isEmail(x);
        })
        .slice(0, 10)
    );
  };

  const onBlur = () => {
    setEmails([
      ...emails,
      ...inputValue
        .split(",")
        .map((x) => x.trim())
        .filter((x) => {
          return x && validator.isEmail(x);
        })
        .slice(0, 10)
    ]);
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
            <WhiteAutocomplete
              multiple
              freeSolo
              id="tags-filled"
              options={[]}
              value={emails}
              inputValue={inputValue}
              onChange={onChange}
              onInputChange={onInputChange}
              onBlur={onBlur}
              getOptionLabel={(option: string) => option}
              defaultValue={[] as string[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="emails"
                  label={t("team-page:invitation.dialog.emails.label")}
                  helperText={t(
                    "team-page:invitation.dialog.emails.helperText"
                  )}
                  className={styles.input}
                  onChange={() => setAlertState({ open: false })}
                  inputProps={{
                    ["data-testid"]: "emails",
                    ...params.inputProps
                  }}
                  isRequired
                  fullWidth
                />
              )}
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
            <Form.SubmitButton
              data-testid="invite-dialog-submit"
              key="btn-send-invitation"
              disabled={loading}
            >
              {t("team-page:invitation.dialog.send")}
            </Form.SubmitButton>
          </Form.ButtonWrapper>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};

export default InvitationDialog;
