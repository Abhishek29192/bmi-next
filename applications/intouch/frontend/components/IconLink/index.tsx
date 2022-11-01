/* eslint-disable security/detect-unsafe-regex */
import { Icon, Typography } from "@bmi-digital/components";
import { SVGImport } from "@bmi-digital/svg-import";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import PublicIcon from "@material-ui/icons/Public";
import React from "react";
import { Link } from "../Link";
import styles from "./styles.module.scss";

export type IconLinkProps = React.AnchorHTMLAttributes<any> & {
  href: string;
  icon: SVGImport;
  label: string;
  isExternal?: boolean;
};

export const IconLink = ({
  href,
  icon,
  label,
  isExternal = false,
  ...rest
}: IconLinkProps) => (
  <Link href={href} isExternal={isExternal} {...rest}>
    <div className={styles.main}>
      <Icon source={icon} color="action" style={{ fontSize: 24 }} />
      <Typography variant="body1">{label}</Typography>
    </div>
  </Link>
);

export const PhoneNumberLink = ({ phoneNumber }: { phoneNumber: string }) => (
  <IconLink
    href={`tel:${phoneNumber}`}
    icon={PhoneIcon}
    label={phoneNumber}
    isExternal
    target="self"
  />
);

export const EmailLink = ({ emailAddress }: { emailAddress: string }) => (
  <IconLink
    href={`mailto:${emailAddress}`}
    icon={EmailIcon}
    label={emailAddress}
    isExternal
    target="self"
  />
);

export const WebsiteLink = ({
  url,
  icon = PublicIcon
}: {
  url: string;
  icon?: SVGImport;
}) => (
  <IconLink
    href={url}
    icon={icon}
    label={url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")}
    isExternal
  />
);
