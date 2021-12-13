import React from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import { ArrowBack } from "@material-ui/icons";
import { useWizardContext } from "./WizardContext";
import styles from "./styles.module.scss";

export const WizardFooter = () => {
  const { t } = useTranslation("project-page");
  const {
    gotoNext,
    gotoBack,
    submit,
    isNextStepAvailable,
    isBackStepAvailable,
    isLastStep,
    isSubmit
  } = useWizardContext();

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
          {t("guarantee_tab.apply_guarantee.wizard.footer.goBack")}
        </Button>

        {!isLastStep ? (
          <Button
            size="large"
            onClick={gotoNext}
            disabled={!isNextStepAvailable}
          >
            {t("guarantee_tab.apply_guarantee.wizard.footer.next")}
          </Button>
        ) : (
          <Button size="large" onClick={submit} disabled={isSubmit}>
            {t("guarantee_tab.apply_guarantee.wizard.footer.submit")}
          </Button>
        )}
      </div>
    </div>
  );
};
