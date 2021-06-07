import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@bmi/typography";
import CompanyDetails from "@bmi/company-details";
import styles from "./styles.module.scss";

export type SmallProfileCardProps = {
  name: string;
  jobTitle: string;
  avatar?: string;
  phoneNumber?: string;
  emailAddress?: string;
};

export const SmallProfileCard = ({
  name,
  avatar,
  jobTitle,
  phoneNumber,
  emailAddress
}: SmallProfileCardProps) => {
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Avatar src={avatar} />
        <div className={styles.nameTag}>
          <Typography className={styles.name}>{name}</Typography>
          <Typography>{jobTitle}</Typography>
        </div>
      </div>
      <div className={styles.body}>
        <CompanyDetails
          details={[
            {
              type: "phone",
              text: phoneNumber,
              action: { model: "htmlLink", href: "tel:" + phoneNumber },
              label: "Telephone"
            },
            {
              type: "email",
              text: emailAddress,
              action: {
                model: "htmlLink",
                href: "mailto:" + emailAddress
              },
              label: "Email"
            }
          ]}
        >
          &nbsp;
          {/* dummy child */}
        </CompanyDetails>
      </div>
    </div>
  );
};
