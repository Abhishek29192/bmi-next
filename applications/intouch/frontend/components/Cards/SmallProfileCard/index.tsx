import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@bmi-digital/components";
import { EmailLink, PhoneNumberLink } from "../../IconLink";
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
        {phoneNumber ? <PhoneNumberLink phoneNumber={phoneNumber} /> : null}
        {emailAddress ? <EmailLink emailAddress={emailAddress} /> : null}
      </div>
    </div>
  );
};
