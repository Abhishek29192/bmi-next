import { Typography } from "@bmi-digital/components";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "next-i18next";
import React from "react";
import styles from "./styles.module.scss";
import { useWizardContext } from "./WizardContext";

export type WizardBodyProps = {
  children: React.ReactNode | React.ReactNode[];
};
export const WizardBody = ({ children }: WizardBodyProps) => {
  const steps: React.ReactNode[] = children as React.ReactNode[];
  const { t } = useTranslation("project-page");
  const { activeStep, header, isSubmit } = useWizardContext();
  return (
    <div className={styles.body}>
      <div className={styles.body__title}>
        <Typography variant="h4">{t(`${header.title}`)}</Typography>
        <Typography variant={"body3"}>{t(`${header.subTitle}`)}</Typography>
        {isSubmit && (
          <div className={styles.spinnerBg}>
            <div className={styles.spinner}>
              <CircularProgress size={100} color="primary" />
            </div>
          </div>
        )}
      </div>
      {steps[+activeStep]}
    </div>
  );
};
