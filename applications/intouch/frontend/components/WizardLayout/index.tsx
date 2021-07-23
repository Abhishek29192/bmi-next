import React from "react";
import Button from "@bmi/button";
import Icon from "@bmi/icon";
import { BMI } from "@bmi/logo";
import { Close, ArrowBack } from "@material-ui/icons";
import Link from "next/link";
import styles from "./styles.module.scss";

export type WizardProps = {
  children: React.ReactNode[];
};

export const Wizard = ({ children }: WizardProps) => (
  <div className={styles.main}>
    <div className={styles.header}>
      <div className={styles.header__inner}>
        <Link href="/">
          <Icon
            source={BMI}
            className={styles.logo}
            style={{ width: 80, display: "block" }}
          />
        </Link>

        <Link href="/">
          <Icon
            source={Close}
            className={styles.logo}
            style={{ fontSize: 40, display: "block" }}
          />
        </Link>
      </div>
    </div>
    <div className={styles.body}>{children}</div>
    <div className={styles.footer}>
      <div className={styles.footer__inner}>
        <Button startIcon={<ArrowBack />} variant="outlined" size="large">
          Go back
        </Button>
        <Button size="large">Next</Button>
      </div>
    </div>
  </div>
);
