import React from "react";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { useWizardContext } from "./WizardContext";
import styles from "./styles.module.scss";

export type WizardBodyProps = {
  children: React.ReactNode | React.ReactNode[];
};
export const WizardBody = ({ children }: WizardBodyProps) => {
  const steps: React.ReactNode[] = children as React.ReactNode[];
  const { t } = useTranslation("project-page");
  const { activeStep, header } = useWizardContext();
  return (
    <div className={styles.body}>
      <div className={styles.body__title}>
        <Typography variant="h4" style={{ textTransform: "capitalize" }}>
          {t(`${header.title}`)}
        </Typography>
        <Typography variant={"body3"}>{t(`${header.subTitle}`)}</Typography>
      </div>
      {steps[+activeStep]}
    </div>
  );
};
