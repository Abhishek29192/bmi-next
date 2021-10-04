import React, { useMemo } from "react";
import Icon from "@bmi/icon";
import { useTranslation } from "next-i18next";
import { Link } from "../Link";
import { useAccountContext } from "../../context/AccountContext";
import { getSidebarLinks } from "../../lib/navigation/sidebar";
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
  const { t } = useTranslation("common");
  const { account } = useAccountContext();

  const links = useMemo(() => getSidebarLinks(account, t), [account, t]);

  return (
    <nav className={styles.sidebarNavigation}>
      {links.map((link) => (
        <SideBarLink
          key={link.href}
          href={link.href}
          icon={link.icon}
          label={link.label}
        />
      ))}
    </nav>
  );
};
