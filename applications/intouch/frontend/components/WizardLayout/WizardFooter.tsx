import React from "react";
import Button from "@bmi/button";
import { ArrowBack } from "@material-ui/icons";
import { useWizardContext } from "./WizardContext";
import styles from "./styles.module.scss";

export const WizardFooter = () => {
  const { gotoNext, gotoBack, isNextStepAvailable, isBackStepAvailable } =
    useWizardContext();

  return (
    <div className={styles.footer}>
      <div className={styles.footer__inner}>
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          size="large"
          onClick={gotoBack}
          disabled={!isBackStepAvailable}
        >
          Go back
        </Button>

        <Button size="large" onClick={gotoNext} disabled={!isNextStepAvailable}>
          Next
        </Button>
      </div>
    </div>
  );
};
