import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import AlertBanner from "@bmi/alert-banner";
import Button from "@bmi/button";
import { Cross as IconCross } from "@bmi/icon";
import { CompanyProfileMandatoryFields } from "../../../lib/validations/company";
import styles from "./styles.module.scss";

type CompanyIncompleteProfileAlertProps = {
  missingFields: CompanyProfileMandatoryFields;
};

const getMissingFieldsLabelMap = (t) => ({
  tradingAddress: t("Main office address"),
  phone: t("Phone"),
  publicEmail: t("Email"),
  aboutUs: t("Description"),
  logo: t("Logo")
});

export const CompanyIncompleteProfileAlert = ({
  missingFields
}: CompanyIncompleteProfileAlertProps) => {
  const { t } = useTranslation("company-page");
  const missingFieldsLabelMap = getMissingFieldsLabelMap(t);

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
              accessibilityLabel="Close alert button"
              onClick={() => setIsAlertShowing(false)}
            >
              <IconCross style={{ width: 24, height: 24 }} />
            </Button>
          </div>
        }
      >
        <AlertBanner.Title>
          {t("company.incomplete_profile_warning")}
        </AlertBanner.Title>
        {missingFields.map((field) => missingFieldsLabelMap[field]).join(", ")}
      </AlertBanner>
    )
  );
};
