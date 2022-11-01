import { BMI, Icon, Logo, StandardPale } from "@bmi-digital/components";
import React from "react";
import styles from "./styles.module.scss";

export type Props = {
  links?: Array<{
    href: string;
    label: string;
  }>;
};

export const Footer = ({ links }: Props) => {
  const navLinks = (links || []).map((link, index) => (
    <a key={index} href={link.href}>
      {link.label}
    </a>
  ));

  return (
    <div className={styles.footer}>
      <Icon source={BMI} style={{ width: 50 }} />
      <nav className={styles.footerNav}>{navLinks}</nav>
      <Logo source={StandardPale} style={{ width: 120 }} />
    </div>
  );
};
