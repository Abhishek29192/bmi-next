import React from "react";
import { Icon } from "@bmi-digital/components";
import { Logo, BMI, StandardPale } from "@bmi-digital/components";
import { Link } from "../Link";
import styles from "./styles.module.scss";

export type Props = {
  links?: ReadonlyArray<{
    href: string;
    label: string;
  }>;
};

export const Footer = ({ links }: Props) => {
  const navLinks = (links || []).map((link, index) => (
    <Link key={index} href={link.href}>
      {link.label}
    </Link>
  ));

  return (
    <div className={styles.footer}>
      <Icon source={BMI} style={{ width: 50 }} />
      <nav className={styles.footerNav}>{navLinks}</nav>
      <Logo source={StandardPale} style={{ width: 120 }} />
    </div>
  );
};
