/* eslint-disable security/detect-unsafe-regex */
import React from "react";
import Link from "next/link";
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
