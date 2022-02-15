import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { AlertBanner } from "@bmi-digital/components";
import { Button } from "@bmi-digital/components";
import { Cross as IconCross } from "@bmi-digital/components";
import { CompanyProfileMandatoryFields } from "../../../../lib/validations/company";
import styles from "./styles.module.scss";

type IncompleteProfileAlertProps = {
  missingFields: CompanyProfileMandatoryFields;
};

export const IncompleteProfileAlert = ({
  missingFields
}: IncompleteProfileAlertProps) => {
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
