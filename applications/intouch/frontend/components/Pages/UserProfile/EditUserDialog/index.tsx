import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { gql } from "@apollo/client";
import Avatar from "@material-ui/core/Avatar";
import Form from "@bmi/form";
import Dialog from "@bmi/dialog";
import TextField from "@bmi/text-field";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import log from "../../../../lib/logger";
import { validatePhoneNumberInput } from "../../../../lib/validations/utils";
import { GetUserProfileQuery } from "../../../../graphql/generated/operations";
import { useUpdateAccountProfileMutation } from "../../../../graphql/generated/hooks";
import styles from "./styles.module.scss";

type EditUserProfileDialogProps = {
  account: GetUserProfileQuery["account"];
  isOpen: boolean;
  onCloseClick: () => any;
  onProfileUpdateSuccess: (account: GetUserProfileQuery["account"]) => any;
};

export const EditUserProfileDialog = ({
  account,
  isOpen,
  onCloseClick,
  onProfileUpdateSuccess
}: EditUserProfileDialogProps) => {
  const { t } = useTranslation(["common", "profile"]);

  const [updateAccountProfile] = useUpdateAccountProfileMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error updating the company: ${error.toString()}`
      });
      // TODO: show some visual error
    },
    onCompleted: ({ updateAccount: { account } }) => {
      log({
        severity: "INFO",
        message: `Updated account - id: ${account.id}`
      });
      onProfileUpdateSuccess && onProfileUpdateSuccess(account);
      onCloseClick && onCloseClick();
    }
  });

  const handleSubmit = useCallback(
    (event, values) => {
      event.preventDefault();

      updateAccountProfile({
        variables: {
          updateAccountInput: {
            id: account.id,
            patch: values
          }
        }
      });
    },
    [updateAccountProfile, account]
  );

  const getFieldProps = useCallback(
    (fieldName: string) => ({
      name: fieldName,
      label: t(`profile:editDialog.form.fields.${fieldName}`),
      defaultValue: account[fieldName],
      fieldIsRequiredError: t("common:error_messages.required"),
      fullWidth: true
    }),
    [account]
  );

  const validatePhoneNumber = useCallback(validatePhoneNumberInput(t), [t]);

  return (
    <Dialog
      open={isOpen}
      onCloseClick={onCloseClick}
      backdropProps={{
        className: "test-backdrop"
      }}
      className={styles.dialog}
    >
      <Dialog.Title hasUnderline>{t("profile:editDialog.title")}</Dialog.Title>

      <Dialog.Content className={styles.dialogContent}>
        <Form
          className={styles.editForm}
          onSubmit={handleSubmit}
          rightAlignButton
        >
          <div className={styles.editAvatar}>
            <h3 className={styles.editAvatarTitle}>
              {t("profile:editDialog.form.fields.photo")}
            </h3>

            <div className={styles.avatarBox}>
              <Avatar
                alt={[account.firstName, account.lastName]
                  .filter(Boolean)
                  .join(" ")}
                src={account.photo}
                className={styles.avatar}
              />
            </div>

            <div>
              <div className={styles.avatarButtons}>
                <Button>
                  {t("profile:editDialog.buttons.uploadProfilePicture")}
                </Button>
                <Button variant="outlined">
                  {t("profile:editDialog.buttons.removeProfilePicture")}
                </Button>
              </div>

              <Typography variant="default">
                {t("profile:editDialog.fileTypesMessage")}
              </Typography>

              <Typography variant="default">
                {" "}
                {t("profile:editDialog.fileSizeMessage")}
              </Typography>
            </div>
          </div>

          <Typography variant="h5" className={styles.editFormSubtitle}>
            {t("profile:editDialog.contactDetailsHeading")}
          </Typography>

          <div className={styles.inputFields}>
            <TextField {...getFieldProps("firstName")} isRequired />
            <TextField {...getFieldProps("lastName")} isRequired />
            <TextField
              {...getFieldProps("phone")}
              getValidationError={validatePhoneNumber}
            />
          </div>
          <Form.ButtonWrapper>
            <Form.SubmitButton className={styles.submitButton}>
              {t("profile:editDialog.buttons.saveAndClose")}
            </Form.SubmitButton>
          </Form.ButtonWrapper>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};

export const UPDATE_ACCOUNT_PROFILE = gql`
  mutation updateAccountProfile($updateAccountInput: UpdateAccountInput!) {
    updateAccount(input: $updateAccountInput) {
      account {
        ...AccountPageDetailsFragment
      }
    }
  }
`;
