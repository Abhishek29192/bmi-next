import React, { useState } from "react";
import CompanyDetails, { DetailProps } from "@bmi/company-details";
import Typography from "@bmi/typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@bmi/button";
import { Account, Role } from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import AccessControl from "../../lib/permissions/AccessControl";
import { isSuperOrMarketAdmin } from "../../lib/account";
import ConfirmDialog, { DialogProps } from "./Dialog";

import styles from "./styles.module.scss";

export type UserCardProps = {
  account: Account;
  companyName: string;
  testid?: string;
  onAccountUpdate?: (id: number, role: Role) => void;
  details: readonly DetailProps[];
  onRemoveUser: () => void;
};

export const UserCard = ({
  account,
  companyName,
  testid,
  onRemoveUser,
  details,
  onAccountUpdate
}: UserCardProps) => {
  const { t } = useTranslation(["common", "team-page"]);
  const [dialogState, setDialogState] = useState<DialogProps>({
    open: false,
    onConfirm: null,
    title: "",
    text: ""
  });

  const closeDialog = () => {
    setDialogState((prev) => ({
      ...prev,
      open: false
    }));
  };

  const onUpdateRole = () => {
    setDialogState({
      open: true,
      title: "user_card.role_dialog.title",
      text: "user_card.role_dialog.text",
      onConfirm: () => {
        onAccountUpdate(
          account.id,
          account.role === "INSTALLER" ? "COMPANY_ADMIN" : "INSTALLER"
        );
        closeDialog();
      }
    });
  };

  const onRemoveUserFromCompany = () => {
    setDialogState({
      open: true,
      title: "user_card.remove_user_dialog.title",
      text: "user_card.remove_user_dialog.text",
      onConfirm: () => {
        onRemoveUser();
        closeDialog();
      }
    });
  };

  const isPowerfulUser = isSuperOrMarketAdmin(account);

  return account ? (
    <div data-testid={testid} className={styles.main}>
      <div className={styles.content}>
        <Avatar
          style={{ height: "150px", width: "150px" }}
          src={account.photo}
        />
        <Typography variant="h5" className={styles.userName}>
          {`${account.firstName} ${account.lastName}`}
        </Typography>
        <Typography className={styles.role}>
          {t(`common:roles.${account.role}`)}
        </Typography>
        <Typography variant="body1" className={styles.companyName}>
          {companyName}
        </Typography>
        {!isPowerfulUser && (
          <AccessControl dataModel="company" action="changeRole">
            <Button
              data-testid="change-role"
              onClick={onUpdateRole}
              variant="text"
            >
              {account.role === "INSTALLER"
                ? t("team-page:user_card.add_admin")
                : t("team-page:user_card.remove_admin")}
            </Button>
          </AccessControl>
        )}

        <div className={styles.details}>
          {/* TODO: Fix CompanyDetails child requirement in DXB */}
          <CompanyDetails details={details}>&nbsp;</CompanyDetails>
        </div>
        {account.role === "INSTALLER" &&
          account?.companyMembers?.nodes?.length > 0 && (
            <AccessControl dataModel="company" action="removeUser">
              <div className={styles.buttonHolder}>
                <Button
                  data-testid="remove-member"
                  onClick={onRemoveUserFromCompany}
                >
                  {t("team-page:user_card.remove")}
                </Button>
              </div>
            </AccessControl>
          )}
      </div>
      <ConfirmDialog
        dialogState={dialogState}
        onCancel={() => setDialogState((prev) => ({ ...prev, open: false }))}
      />
    </div>
  ) : null;
};
