import React from "react";
import {
  Home,
  Build,
  School,
  People,
  Business,
  Work
} from "@material-ui/icons";
import { useTranslation } from "next-i18next";
import { SideBarLink } from "../Link";
import styles from "./styles.module.scss";

export const Sidebar = () => {
  const { t } = useTranslation("sidebar");

  return (
    <nav className={styles.sidebarNavigation}>
      <SideBarLink href="/" icon={Home} label={t("Home")} />
      <SideBarLink href="/projects" icon={Build} label={t("Projects")} />
      <SideBarLink href="/training" icon={School} label={t("Training")} />
      <SideBarLink href="/team" icon={People} label={t("Team")} />
      <SideBarLink href="/company" icon={Business} label={t("Company")} />
      <SideBarLink href="/toolkit" icon={Work} label={t("Toolkit")} />
    </nav>
  );
};
