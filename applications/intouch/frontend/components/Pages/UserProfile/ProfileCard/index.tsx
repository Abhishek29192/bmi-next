import React from "react";
import { useTranslation } from "next-i18next";
import ProfileCard from "@bmi/profile-card";
import Button from "@bmi/button";
import { Account } from "@bmi/intouch-api-types";
import { Email, Phone, Edit } from "@material-ui/icons";
import { GetUserProfileQuery } from "../../../../graphql/generated/operations";
import { EditUserProfileDialog } from "../EditUserDialog";
import styles from "./styles.module.scss";

type UserProfileCardProps = {
  account: GetUserProfileQuery["account"];
  onProfileUpdateSuccess: (account: Account) => any;
};

export const UserProfileCard = ({
  account,
  onProfileUpdateSuccess
}: UserProfileCardProps) => {
  const { firstName, lastName, email, phone, photo, role } = account;
  const { t } = useTranslation(["common", "profile"]);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] =
    React.useState(false);

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <ProfileCard
        imageSource={photo}
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
            action={{ model: "htmlLink", href: "mailto:" + email }}
            icon={Email}
          >
            {email}
          </ProfileCard.Row>
        )}

        <div className={styles.cardChildren}>
          <Button
            variant="link"
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
          <Button>{t("profile:profileCard.buttons.changePassword")}</Button>
        </div>
      </ProfileCard>
    </div>
  );
};
