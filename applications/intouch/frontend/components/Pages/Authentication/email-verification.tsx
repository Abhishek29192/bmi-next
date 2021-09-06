import React from "react";
import { useTranslation } from "next-i18next";
import Typography from "@bmi/typography/src";

const EmailVerification = () => {
  const { t } = useTranslation("email-verification");
  return (
    <div>
      <Typography variant="h3">{t("title")}</Typography>
      <Typography variant="body1">{t("body")}</Typography>
    </div>
  );
};

export default EmailVerification;
