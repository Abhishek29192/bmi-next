import React from "react";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { GetCompanyQuery } from "../../../graphql/generated/operations";
import { InfoPair } from "../../InfoPair";
import { Address } from "../../Address";
import styles from "./styles.module.scss";

export type CompanyRegisteredDetailsProps = {
  company: GetCompanyQuery["company"];
};

export const CompanyRegisteredDetails = ({
  company
}: CompanyRegisteredDetailsProps) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline style={{ fontSize: "1.2rem" }}>
        {t("Registered Details")}
      </Typography>
      <div className={styles.body}>
        <InfoPair title={t("Registered name")}>{company.name}</InfoPair>
        <InfoPair title={t("Membership number")}>
          {company.referenceNumber}
        </InfoPair>
        <InfoPair title={t("Registered address")}>
          <Address address={company.registeredAddress} />
        </InfoPair>
        <InfoPair title={t("Company VAT number")}>{company.taxNumber}</InfoPair>
        <InfoPair title={t("Tier")}>{company.tier}</InfoPair>
      </div>
    </div>
  );
};
