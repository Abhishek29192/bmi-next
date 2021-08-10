import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import AlertBanner from "@bmi/alert-banner";
import Button from "@bmi/button";
import { Cross as IconCross } from "@bmi/icon";
import { CompanyProfileMandatoryFields } from "../../../../lib/validations/company";
import styles from "./styles.module.scss";

type CompanyIncompleteProfileAlertProps = {
  missingFields: CompanyProfileMandatoryFields;
};

export const CompanyIncompleteProfileAlert = ({
  missingFields
}: CompanyIncompleteProfileAlertProps) => {
  const { t } = useTranslation("company-page");
  const [isAlertShowing, setIsAlertShowing] = useState(true);

  return (
    isAlertShowing && (
      <AlertBanner
        severity="warning"
        actions={
          <div className={styles.closeButtonContainer}>
            <Button
              data-testid="CloseButton"
              isIconButton
              variant="text"
              accessibilityLabel={t(
                "incompleteProfile.closeAlertAccessibilityLabel"
              )}
              onClick={() => setIsAlertShowing(false)}
            >
              <IconCross style={{ width: 24, height: 24 }} />
            </Button>
          </div>
        }
      >
        <AlertBanner.Title>{t("incompleteProfile.warning")}</AlertBanner.Title>
        {missingFields
          .map((field) => t(`incompleteProfile.fields.${field}`))
          .join(", ")}
      </AlertBanner>
    )
  );
};
