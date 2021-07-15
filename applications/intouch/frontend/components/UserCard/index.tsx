import React from "react";
import CompanyDetails, { DetailProps } from "@bmi/company-details";
import Typography from "@bmi/typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@bmi/button";
import { Account, Role } from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("team-page");

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
          {account.role?.replace("_", " ")?.toLowerCase()}
        </Typography>
        <Typography variant="body1" className={styles.companyName}>
          {companyName}
        </Typography>
        <Button
          onClick={() =>
            onAccountUpdate(
              account.id,
              account.role === "INSTALLER" ? "COMPANY_ADMIN" : "INSTALLER"
            )
          }
          variant="text"
        >
          {account.role === "INSTALLER"
            ? t("user_card.add_admin")
            : t("user_card.remove_admin")}
        </Button>
        <div className={styles.details}>
          {/* TODO: Fix CompanyDetails child requirement in DXB */}
          <CompanyDetails details={details}>&nbsp;</CompanyDetails>
        </div>
        <div className={styles.buttonHolder}>
          <Button data-testid="remove-member" onClick={onRemoveUser}>
            {t("Remove from company")}
          </Button>
        </div>
      </div>
    </div>
  ) : null;
};
