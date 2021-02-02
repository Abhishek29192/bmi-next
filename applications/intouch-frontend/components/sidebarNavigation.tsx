import React from "react";
import Link from "./Link";
import Icon from "@bmi/icon";
import {
  Home,
  Build,
  School,
  People,
  Business,
  Work
} from "@material-ui/icons";
import styles from "./styles/SidebarNavigation.module.scss";

import { useTranslation } from "next-i18next";

export const Sidebar: React.FC<{}> = () => {
  const { t } = useTranslation("sidebar");

  return (
    <ul className={styles.sidebarNavigation}>
      <Link href="/">
        <a className={styles.sidebarLink}>
          <Icon source={Home} color="primary" style={{ fontSize: 24 }} />
          {t("Home")}
        </a>
      </Link>
      <Link href="/projects">
        <a className={styles.sidebarLink}>
          <Icon source={Build} color="primary" style={{ fontSize: 24 }} />
          Projects
        </a>
      </Link>
      <Link href="/training">
        <a className={styles.sidebarLink}>
          <Icon source={School} color="primary" style={{ fontSize: 24 }} />
          Training
        </a>
      </Link>
      <Link href="/team">
        <a className={styles.sidebarLink}>
          <Icon source={People} color="primary" style={{ fontSize: 24 }} />
          Team
        </a>
      </Link>
      <Link href="/company">
        <a className={styles.sidebarLink}>
          <Icon source={Business} color="primary" style={{ fontSize: 24 }} />
          Company
        </a>
      </Link>
      <Link href="/toolkit">
        <a className={styles.sidebarLink}>
          <Icon source={Work} color="primary" style={{ fontSize: 24 }} />
          Toolkit
        </a>
      </Link>
    </ul>
  );
};
