import React from "react";
import { Button } from "@bmi-digital/components";
import { Account } from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import can from "../../../lib/permissions/can";
import { getGtmData } from "../../../lib/utils/gtm";
import { Link } from "../../Link";

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
  const buttonLabel = buttonText || t(`hero.cta.${ctaName}`);
  const dataGtm = getGtmData("cta-click1", buttonLabel, url);

  if (!can(account, "home", "MerchandiseSso") || !merchandiseSso) {
    return (
      <Button
        hasDarkBackground
        variant="outlined"
        style={{ marginTop: "2em" }}
        disabled={true}
      >
        {buttonLabel}
      </Button>
    );
  }

  return (
    <Link data-gtm={dataGtm} href={url} isExternal={true}>
      <Button hasDarkBackground variant="outlined" style={{ marginTop: "2em" }}>
        {buttonLabel}
      </Button>
    </Link>
  );
};
