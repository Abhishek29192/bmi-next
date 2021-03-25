import React from "react";
import Link from "next/link";
import Icon from "@bmi/icon";
import styles from "./styles/Sidebar.module.scss";

type Props = {
  href?: string;
  icon: SVGImport;
  label: string;
};

const SelectedLink = ({ href, icon, label }: Props) => {
  return (
    <Link href={href}>
      <a className={styles.sidebarLink}>
        <Icon source={icon} color="primary" style={{ fontSize: 24 }} />
        {label}
      </a>
    </Link>
  );
};

export default SelectedLink;
