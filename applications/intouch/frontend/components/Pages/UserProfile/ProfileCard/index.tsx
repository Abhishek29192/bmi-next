import { gql } from "@apollo/client";
import { Button, ProfileCard } from "@bmi-digital/components";
import { Edit, Email, Phone } from "@material-ui/icons";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { useResetPasswordMutation } from "../../../../graphql/generated/hooks";
import { GetUserProfileQuery } from "../../../../graphql/generated/operations";
import { EditUserProfileDialog } from "../EditUserDialog";
import CompletedDialog, { DialogProps } from "./Dialog";
import styles from "./styles.module.scss";

type UserProfileCardProps = {
  account: GetUserProfileQuery["account"];
  onProfileUpdateSuccess: (account: GetUserProfileQuery["account"]) => any;
};

export const RESET_PASSWORD = gql`
  mutation resetPassword {
    resetPassword
  }
`;

export const UserProfileCard = ({
  account,
  onProfileUpdateSuccess
}: UserProfileCardProps) => {
  const { firstName, lastName, email, phone, photo, role, signedPhotoUrl } =
    account;
  const { t } = useTranslation(["common", "profile"]);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);

  const [dialogState, setDialogState] = useState<DialogProps>({
    open: false,
    title: "",
    text: ""
  });

  const [resetPassword] = useResetPasswordMutation({
    onCompleted: ({ resetPassword }) => {
      if (resetPassword === "ok") {
        setDialogState((prevState) => ({
          ...prevState,
          open: true,
          title: "profile:passwordReset.dialog.title",
          text: "profile:passwordReset.dialog.success"
        }));
      } else {
        setDialogState((prevState) => ({
          ...prevState,
          open: true,
          title: "profile:passwordReset.dialog.title",
          text: "profile:passwordReset.dialog.error"
        }));
      }
    }
  });

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <ProfileCard
        imageSource={signedPhotoUrl || photo}
        body={
          <ProfileCard.Body
            name={[firstName, lastName].filter(Boolean).join(" ")}
            title={t(`common:roles.${role}`)}
          />
        }
      >
        {phone && <ProfileCard.Row icon={Phone}>{phone}</ProfileCard.Row>}
        {email && (
          <ProfileCard.Row
            action={{ model: "htmlLink", href: `mailto:${email}` }}
            icon={Email}
          >
            {email}
          </ProfileCard.Row>
        )}

        <div className={styles.cardChildren}>
          <Button
            variant="text"
            startIcon={<Edit />}
            onClick={() => setIsEditProfileDialogOpen(true)}
          >
            {t("profile:profileCard.buttons.editProfile")}
          </Button>

          <EditUserProfileDialog
            account={account}
            isOpen={isEditProfileDialogOpen}
            onCloseClick={() => setIsEditProfileDialogOpen(false)}
            onProfileUpdateSuccess={onProfileUpdateSuccess}
          />
          <Button onClick={resetPassword}>
            {t("profile:profileCard.buttons.changePassword")}
          </Button>
          <CompletedDialog
            dialogState={dialogState}
            onCancel={() =>
              setDialogState((prev) => ({ ...prev, open: false }))
            }
          />
        </div>
      </ProfileCard>
    </div>
  );
};
