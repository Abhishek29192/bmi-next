import { gql } from "@apollo/client";
import { Dialog, Form, TextField, Typography } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React, { useCallback, useState } from "react";
import { useUpdateAccountProfileMutation } from "../../../../graphql/generated/hooks";
import { GetUserProfileQuery } from "../../../../graphql/generated/operations";
import log from "../../../../lib/logger";
import { validatePhoneNumberInput } from "../../../../lib/validations/utils";
import { ProfilePictureUpload } from "../../../ProfilePictureUpload";
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

  const profilePictureUrl = account.signedPhotoUrl || account.photo;
  const [uploadedPhoto, setUploadedPhoto] = useState(undefined);
  const [shouldRemovePhoto, setShouldRemovePhoto] = useState(false);
  const [fileSizeRestriction, setFileSizeRestriction] = useState(false);
  const [fileValidationMessage, setFileValidationMessage] = useState("");

  // You cannot upload files larger than <MAX_FILE_SIZE> MB (It's megabyte)
  const MAX_FILE_SIZE = 3;

  const [updateAccountProfile, { loading }] = useUpdateAccountProfileMutation({
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

            patch: {
              ...values,
              photoUpload: uploadedPhoto,
              shouldRemovePhoto
            }
          }
        }
      });
    },
    [updateAccountProfile, account, uploadedPhoto, shouldRemovePhoto]
  );

  const onValidationException = (restriction: boolean, message: string) => {
    setFileSizeRestriction(restriction);
    setFileValidationMessage(message);
  };

  const handleClose = useCallback(() => {
    onCloseClick && onCloseClick();
    onValidationException(false, "");
  }, []);

  const getFieldProps = useCallback(
    (fieldName: string) => ({
      name: fieldName,
      label: t(`profile:editDialog.form.fields.${fieldName}`),
      // eslint-disable-next-line security/detect-object-injection
      defaultValue: account[fieldName],
      fieldIsRequiredError: t("common:error_messages.required"),
      fullWidth: true
    }),
    [account]
  );

  const validatePhoneNumber = useCallback(validatePhoneNumberInput(t), [t]);

  const onProfilePictureChange = (file) => {
    setShouldRemovePhoto(!file);
    setUploadedPhoto(file);
    onValidationException(false, "");

    if (file?.size > MAX_FILE_SIZE * (1024 * 1024)) {
      onValidationException(
        true,
        `${t(
          "profile:editDialog.fileSizeValidationMessage"
        )} ${MAX_FILE_SIZE}MB`
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onCloseClick={handleClose}
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
          <ProfilePictureUpload
            title={t("profile:editDialog.form.fields.photo")}
            uploadPictureLabel={t(
              "profile:editDialog.buttons.uploadProfilePicture"
            )}
            removePictureLabel={t(
              "profile:editDialog.buttons.removeProfilePicture"
            )}
            altText={[account.firstName, account.lastName]
              .filter(Boolean)
              .join(" ")}
            initialPictureUrl={profilePictureUrl}
            onChange={onProfilePictureChange}
            fileTypesMessage={t("profile:editDialog.fileTypesMessage")}
            fileSizeMessage={t("profile:editDialog.fileSizeMessage")}
            fileValidationMessage={fileValidationMessage}
          />

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
            <Form.SubmitButton
              disabled={loading || fileSizeRestriction}
              className={styles.submitButton}
            >
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
