import { useTranslation } from "next-i18next";
import { Button } from "@bmi/components";
import React from "react";
import { Account } from "@bmi/intouch-api-types";
import { Link } from "../../Link";
import can from "../../../lib/permissions/can";

export const MerchandiseCTA = ({
  ctaName,
  url,
  buttonText,
  account,
  merchandiseSso
}: {
  ctaName: string;
  url: string;
  buttonText?: string;
  account: Account;
  merchandiseSso: boolean;
}) => {
  const { t } = useTranslation("home-page");

  if (!can(account, "home", "MerchandiseSso") || !merchandiseSso) {
    return (
      <Button
        hasDarkBackground
        variant="outlined"
        style={{ marginTop: "2em" }}
        disabled={true}
      >
        {buttonText || t(`hero.cta.${ctaName}`)}
      </Button>
    );
  }

  return (
    <Link href={url} isExternal={true}>
      <Button hasDarkBackground variant="outlined" style={{ marginTop: "2em" }}>
        {buttonText || t(`hero.cta.${ctaName}`)}
      </Button>
    </Link>
  );
};
