import React from "react";
import Link from "next/link";
import Icon from "@bmi/icon";
import Logo, { BMI, StandardPale } from "@bmi/logo";
import { useTranslation } from "next-i18next";
import styles from "./styles.module.scss";

export const Footer = () => {
  const { t } = useTranslation("footer");
  return (
    <div className={styles.footer}>
      <Icon source={BMI} style={{ width: 50 }} />
      <nav className={styles.footerNav}>
        <Link href="/privacy-policy">{t("Privacy Policy")}</Link>
        <Link href="/terms-of-use">{t("Terms of use")}</Link>
        <Link href="/cookie-policy">{t("Cookie Policy")}</Link>
      </nav>
      <Logo source={StandardPale} style={{ width: 120 }} />
    </div>
  );
};
