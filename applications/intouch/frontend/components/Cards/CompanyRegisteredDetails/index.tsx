import React from "react";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { InfoPair } from "../../InfoPair";
import styles from "./styles.module.scss";

export type CompanyRegisteredDetailsProps = {
  registeredName: string;
  registeredAddress: string;
  companyVatNumber: string;
  contract: string;
};

export const CompanyRegisteredDetails = ({
  registeredName,
  registeredAddress,
  companyVatNumber,
  contract
}: CompanyRegisteredDetailsProps) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline style={{ fontSize: "1.2rem" }}>
        Registered Details
      </Typography>
      <div className={styles.body}>
        <InfoPair title={t("Registered Name")}>{registeredName}</InfoPair>
        <InfoPair title={t("Registered Address")}>{registeredAddress}</InfoPair>
        <InfoPair title={t("Company VAT Number")}>{companyVatNumber}</InfoPair>
        <InfoPair title={t("Contract")}>{contract}</InfoPair>
      </div>
    </div>
  );
};
