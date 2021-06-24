import React from "react";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { InfoPair } from "../../InfoPair";
import { NoContent } from "../../NoContent";
import styles from "./styles.module.scss";

export type BuildingOwnerDetailsProps = {
  name: string;
  email: string;
  company: string;
  address: string;
};

export const BuildingOwnerDetails = ({
  name,
  email,
  company,
  address
}: BuildingOwnerDetailsProps) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.main}>
      <Typography variant="h5">{t("Building Owner Details")}</Typography>
      {!company ? (
        <NoContent message="Building owner details have not been added to this project" />
      ) : (
        <div className={styles.body}>
          <InfoPair title={t("Name")}>{name}</InfoPair>
          <InfoPair title={t("Email")}>{email}</InfoPair>
          <InfoPair title={t("Company")}>{company}</InfoPair>
          <InfoPair title={t("Building Owner Address")}>{address}</InfoPair>
        </div>
      )}
    </div>
  );
};
