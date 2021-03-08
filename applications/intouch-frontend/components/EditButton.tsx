import React from "react";
import { Home } from "@material-ui/icons";
import { useTranslation } from "next-i18next";
import Link from "./Link";

export const EditButton = () => {
  const { t } = useTranslation("common");

  return (
    <nav>
      <Link href="/" icon={Home} label={t("Home")} />
    </nav>
  );
};
