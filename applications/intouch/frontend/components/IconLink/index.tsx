/* eslint-disable security/detect-unsafe-regex */
import React from "react";
import Link from "next/link";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import Icon from "@bmi/icon";
import Typography from "@bmi/typography";
import styles from "./styles.module.scss";

export type IconLinkProps = {
  href: string;
  icon: SVGImport;
  label: string;
};

export const IconLink = ({ href, icon, label }: IconLinkProps) => {
  return (
    <Link href={href}>
      <a className={styles.main}>
        <Icon source={icon} color="action" style={{ fontSize: 24 }} />
        <Typography variant="body1">
          {label.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")}
        </Typography>
      </a>
    </Link>
  );
};

export const PhoneNumberLink = ({ phoneNumber }: { phoneNumber: string }) => (
  <IconLink href={`tel:${phoneNumber}`} icon={PhoneIcon} label={phoneNumber} />
);

export const EmailLink = ({ emailAddress }: { emailAddress: string }) => (
  <IconLink
    href={`mailto:${emailAddress}`}
    icon={EmailIcon}
    label={emailAddress}
  />
);
