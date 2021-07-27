import React from "react";
import Button from "@bmi/button";
import { ArrowBack } from "@material-ui/icons";
import { useWizardContext } from "../../context/WizardContext";
import styles from "./styles.module.scss";

export const WizardFooter = () => {
  const { activeStep, setStep } = useWizardContext();
  return (
    <div className={styles.footer}>
      <div className={styles.footer__inner}>
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          size="large"
          onClick={() => {
            setStep(activeStep - 1);
          }}
        >
          Go back
        </Button>
        <Button
          size="large"
          onClick={() => {
            setStep(activeStep + 1);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
