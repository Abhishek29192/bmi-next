import React from "react";
import Icon from "@bmi/icon";
import { BMI } from "@bmi/logo";
import { Close } from "@material-ui/icons";
import Link from "next/link";
import WizardContextWrapper from "../../context/WizardContext";
import styles from "./styles.module.scss";
import { WizardBody } from "./WizardBody";
import { WizardFooter } from "./WizardFooter";

export type WizardProps = {
  children: React.ReactNode | React.ReactNode[];
};

export const Wizard = ({ children }: WizardProps) => {
  return (
    <WizardContextWrapper step={0}>
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
        <WizardBody>{children}</WizardBody>
        <WizardFooter />
      </div>
    </WizardContextWrapper>
  );
};
