import React from "react";
import { useTranslation } from "next-i18next";
import Typography from "@bmi/typography";
import Button from "@bmi/button";

const EmailVerification = () => {
  const { t } = useTranslation("email-verification");
  return (
    <div>
      <Typography variant="h3">{t("title")}</Typography>
      <Typography
        style={{
          marginTop: 15
        }}
        variant="body1"
      >
        {t("body")}
      </Typography>
      <Button
        style={{
          marginTop: 60
        }}
        href="/api/auth/logout"
      >
        {t("back_login")}
      </Button>
    </div>
  );
};

export default EmailVerification;
