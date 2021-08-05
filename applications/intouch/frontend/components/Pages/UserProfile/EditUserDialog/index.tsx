import React from "react";
import { useTranslation } from "next-i18next";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@bmi/dialog";
import TextField from "@bmi/text-field";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import { GetUserProfileQuery } from "../../../../graphql/generated/operations";
import styles from "./styles.module.scss";

type EditUserProfileDialogProps = {
  account: GetUserProfileQuery["account"];
  isOpen: boolean;
  onCloseClick: () => any;
};

export const EditUserProfileDialog = ({
  account,
  isOpen,
  onCloseClick
}: EditUserProfileDialogProps) => {
  const { t } = useTranslation("profile");

  return (
    <Dialog
      open={isOpen}
      onCloseClick={onCloseClick}
      backdropProps={{
        className: "test-backdrop"
      }}
      className={styles.dialog}
    >
      <Dialog.Title hasUnderline>{t("editModal.title")}</Dialog.Title>

      <Dialog.Content className={styles.dialogContent}>
        <div className={styles.editForm}>
          <div className={styles.editAvatar}>
            <h3 className={styles.editAvatarTitle}>Profile picture</h3>
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
                <Button>{t("editModal.buttons.uploadProfilePicture")}</Button>
                <Button variant="outlined">
                  {t("editModal.buttons.removeProfilePicture")}
                </Button>
              </div>
              <Typography variant="default">
                {t("editModal.fileTypesMessage")}
              </Typography>
              <Typography variant="default">
                {" "}
                {t("editModal.fileSizeMessage")}
              </Typography>
            </div>
          </div>

          <Typography variant="h5" className={styles.editFormSubtitle}>
            {t("editModal.labels.contactDetails")}
          </Typography>
          <div className={styles.inputFields}>
            <TextField
              id="email"
              name="Email"
              label={t("editModal.labels.email")}
              variant="outlined"
              defaultValue={account.email}
            />
            <TextField
              id="phone"
              name="phone"
              label={t("editModal.labels.phone")}
              variant="outlined"
              defaultValue={account.phone}
            />
          </div>
        </div>

        <Dialog.Actions
          className={styles.dialogClose}
          confirmLabel={t("editModal.buttons.saveAndClose")}
          // TODO: actually perform the change
          onConfirmClick={onCloseClick}
        />
      </Dialog.Content>
    </Dialog>
  );
};
