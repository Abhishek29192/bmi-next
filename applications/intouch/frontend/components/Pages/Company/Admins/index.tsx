import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Button, Grid, Typography } from "@bmi/components";
import { GetCompanyQuery } from "../../../../graphql/generated/operations";
import { SmallProfileCard } from "../../../Cards/SmallProfileCard";
import { sortByLastName } from "../../../../lib/utils/account";
import styles from "./styles.module.scss";

type AdminsProps = {
  admins: GetCompanyQuery["company"]["companyMembers"]["nodes"];
  count?: number;
  title?: string;
};

export const CompanyAdmins = ({
  admins,
  count = 6,
  title = ""
}: AdminsProps) => {
  const { t } = useTranslation("common");

  const [expandAllMembers, setExpandAllMembers] = useState<boolean>(true);
  const [countToShow, setCountToShow] = useState<number>(count);
  const [buttonLabel, setButtonLabel] = useState<string>("button.more");

  const toggleExpandMembers = () => {
    setExpandAllMembers(!expandAllMembers);
    setCountToShow(count);
    setButtonLabel("button.more");

    if (expandAllMembers) {
      setCountToShow(999);
      setButtonLabel("button.less");
    }
  };

  return (
    <div className={styles.wrapper}>
      {admins.length > 0 && title && (
        <Typography variant="h6" className={styles.headerText}>
          {title}
        </Typography>
      )}
      <Grid container spacing={3} alignItems="stretch">
        {sortByLastName(admins.slice(0, countToShow)).map(({ account }) => (
          <Grid item xs={12} md={6} key={account.id}>
            <SmallProfileCard
              name={[account.firstName, account.lastName].join(" ")}
              jobTitle={t(`roles.${account.role}`)}
              phoneNumber={account.phone}
              emailAddress={account.email}
              avatar={account.photo}
            />
          </Grid>
        ))}
      </Grid>
      {admins.length > count && (
        <div className={styles.more}>
          <Button variant="outlined" onClick={toggleExpandMembers}>
            {t(buttonLabel)}
          </Button>
        </div>
      )}
    </div>
  );
};

export const CompanyAdminsFragment = gql`
  fragment CompanyAdminsFragment on Company {
    companyMembers {
      nodes {
        account {
          role
          id
          firstName
          lastName
          role
          phone
          email
          photo
        }
      }
    }
  }
`;
