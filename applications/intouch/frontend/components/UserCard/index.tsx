import React, { useState } from "react";
import { CompanyDetails, CompanyDetailProps } from "@bmi/components";
import { Typography } from "@bmi/components";
import Avatar from "@material-ui/core/Avatar";
import { Button } from "@bmi/components";
import { Account, Role } from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import AccessControl from "../../lib/permissions/AccessControl";
import { isSuperOrMarketAdmin, isSuperAdmin } from "../../lib/account";
import { useAccountContext } from "../../context/AccountContext";
import ConfirmDialog, { DialogProps } from "./Dialog";

import styles from "./styles.module.scss";

export type UserCardProps = {
  account: Account;
  companyName: string;
  testid?: string;
  onAccountUpdate?: (id: number, role: Role) => void;
  details: CompanyDetailProps[];
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
  const { account: user } = useAccountContext();
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

  const onUpdateRole = (role) => {
    setDialogState({
      open: true,
      title: "user_card.role_dialog.title",
      text: "user_card.role_dialog.text",
      onConfirm: () => {
        onAccountUpdate(account.id, role);
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

  const isCompanyMember = account?.companyMembers?.nodes?.length > 0;
  const canChangeUserRole = !isSuperOrMarketAdmin(account) && isCompanyMember;

  return account ? (
    <div data-testid={testid} className={styles.main}>
      <div className={styles.content}>
        <div className={styles.info}>
          <Avatar
            style={{ height: "150px", width: "150px" }}
            src={account.signedPhotoUrl}
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
          {canChangeUserRole && (
            <AccessControl dataModel="company" action="changeRole">
              <Button
                data-testid="change-role"
                onClick={() =>
                  onUpdateRole(
                    account.role === "INSTALLER" ? "COMPANY_ADMIN" : "INSTALLER"
                  )
                }
                variant="text"
              >
                {account.role === "INSTALLER"
                  ? t("team-page:user_card.add_admin")
                  : t("team-page:user_card.remove_admin")}
              </Button>
            </AccessControl>
          )}
          {isSuperAdmin(user) &&
            !isCompanyMember &&
            (account.role === "INSTALLER" || account.role === "AUDITOR") && (
              <AccessControl dataModel="company" action="changeRole">
                <Button
                  data-testid="change-role-auditor"
                  onClick={() =>
                    onUpdateRole(
                      account.role === "INSTALLER" ? "AUDITOR" : "INSTALLER"
                    )
                  }
                >
                  {account.role === "INSTALLER"
                    ? t("team-page:user_card.add_auditor")
                    : t("team-page:user_card.remove_auditor")}
                </Button>
              </AccessControl>
            )}
        </div>

        <div className={styles.details}>
          {/* TODO: Fix CompanyDetails child requirement in DXB */}
          <CompanyDetails details={details}>{null}</CompanyDetails>
        </div>
        {account.role === "INSTALLER" && isCompanyMember && (
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
