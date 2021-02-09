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
import Link from "./Link";
import styles from "./styles/Sidebar.module.scss";

export const Sidebar = () => {
  const { t } = useTranslation("sidebar");

  return (
    <nav className={styles.sidebarNavigation}>
      <Link href="/" icon={Home} label={t("Home")} />
      <Link href="/projects" icon={Build} label={t("Projects")} />
      <Link href="/training" icon={School} label={t("Training")} />
      <Link href="/team" icon={People} label={t("Team")} />
      <Link href="/company" icon={Business} label={t("Company")} />
      <Link href="/toolkit" icon={Work} label={t("Toolkit")} />
    </nav>
  );
};
