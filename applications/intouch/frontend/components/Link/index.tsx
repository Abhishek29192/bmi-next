import React from "react";
import Link from "next/link";
import Icon from "@bmi/icon";
import styles from "../Sidebar/styles.module.scss";

export type SideBarLinkProps = {
  href?: string;
  icon: SVGImport;
  label: string;
};

export const SideBarLink = ({ href, icon, label }: SideBarLinkProps) => {
  return (
    <Link href={href}>
      <a className={styles.sidebarLink}>
        <Icon source={icon} color="primary" style={{ fontSize: 24 }} />
        {label}
      </a>
    </Link>
  );
};
