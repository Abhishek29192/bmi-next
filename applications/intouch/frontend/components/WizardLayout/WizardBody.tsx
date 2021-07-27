import React from "react";
import Typography from "@bmi/typography";
import { useWizardContext } from "../../context/WizardContext";
import styles from "./styles.module.scss";

export type WizardBodyProps = {
  children: React.ReactNode | React.ReactNode[];
};
export const WizardBody = ({ children }: WizardBodyProps) => {
  const steps: React.ReactNode[] = children as React.ReactNode[];
  const { activeStep, title, subTitle } = useWizardContext();
  return (
    <div className={styles.body}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="h4">{title}</Typography>
        <Typography variant={"body3"}>{subTitle}</Typography>
      </div>
      {steps[+activeStep]}
    </div>
  );
};
