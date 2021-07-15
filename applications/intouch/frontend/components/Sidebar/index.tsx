import React from "react";
import {
  Home,
  Build,
  School,
  People,
  Business,
  Work
} from "@material-ui/icons";
import Icon from "@bmi/icon";
import { useTranslation } from "next-i18next";
import { Link } from "../Link";
import styles from "./styles.module.scss";

export type SideBarLinkProps = {
  href: string;
  icon: SVGImport;
  label: string;
};

export const SideBarLink = ({ href, icon, label }: SideBarLinkProps) => (
  <Link href={href}>
    <a className={styles.sidebarLink}>
      <Icon source={icon} color="primary" style={{ fontSize: 24 }} />
      {label}
    </a>
  </Link>
);

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
