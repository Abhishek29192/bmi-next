import React from "react";
import Typography from "@bmi/typography";
import { useWizardContext } from "./WizardContext";
import styles from "./styles.module.scss";

export type WizardBodyProps = {
  children: React.ReactNode | React.ReactNode[];
};
export const WizardBody = ({ children }: WizardBodyProps) => {
  const steps: React.ReactNode[] = children as React.ReactNode[];
  const { activeStep, header } = useWizardContext();
  return (
    <div className={styles.body}>
      <div
        style={{
          textAlign: "center",
          margin: "10px"
        }}
      >
        <Typography variant="h4" style={{ textTransform: "capitalize" }}>
          {header?.title}
        </Typography>
        <Typography variant={"body3"}>{header?.subTitle}</Typography>
      </div>
      {steps[+activeStep]}
    </div>
  );
};
