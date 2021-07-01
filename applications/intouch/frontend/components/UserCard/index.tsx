import React from "react";
import CompanyDetails, { DetailProps } from "@bmi/company-details";
import Typography from "@bmi/typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@bmi/button";
import { Apartment, Person } from "@material-ui/icons";
import Icon from "@bmi/icon";
import { useTranslation } from "next-i18next";
import styles from "./styles.module.scss";

export type UserCardProps = {
  avatar: string;
  username: string;
  jobtitle: string;
  details: readonly DetailProps[];
};

export const UserCard = ({
  username,
  avatar,
  jobtitle,
  details
}: UserCardProps) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <Avatar style={{ height: "150px", width: "150px" }} src={avatar} />
        <Typography variant="h5">{username}</Typography>
        <Typography className={styles.jobtitle}>{jobtitle}</Typography>
        <div className={styles.icons}>
          <Icon source={Apartment} />
          <Icon source={Person} />
        </div>
        <Button variant="text">{t("Remove as company owner")}</Button>
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