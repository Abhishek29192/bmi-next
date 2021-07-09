import React from "react";
import CompanyDetails, { DetailProps } from "@bmi/company-details";
import Typography from "@bmi/typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@bmi/button";
import { useTranslation } from "next-i18next";
import styles from "./styles.module.scss";

export type UserCardProps = {
  avatar: string;
  username: string;
  role: string;
  companyName: string;
  testid?: string;
  details: readonly DetailProps[];
};

export const UserCard = ({
  username,
  avatar,
  role,
  details,
  companyName,
  testid
}: UserCardProps) => {
  const { t } = useTranslation("common");

  return (
    <div data-testid={testid} className={styles.main}>
      <div className={styles.content}>
        <Avatar style={{ height: "150px", width: "150px" }} src={avatar} />
        <Typography variant="h5" className={styles.userName}>
          {username}
        </Typography>
        <Typography className={styles.role}>{role}</Typography>
        <Typography variant="body1" className={styles.companyName}>
          {companyName}
        </Typography>
        <Button variant="text">{t("Remove as company admin")}</Button>
        <div className={styles.details}>
          {/* TODO: Fix CompanyDetails child requirement in DXB */}
          <CompanyDetails details={details}>&nbsp;</CompanyDetails>
        </div>
        <div className={styles.buttonHolder}>
          <Button>{t("Remove from company")}</Button>
        </div>
      </div>
    </div>
  );
};
